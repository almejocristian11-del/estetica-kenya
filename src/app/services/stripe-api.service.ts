import { Injectable } from '@angular/core';
import { CapacitorHttp } from '@capacitor/core';
import { environment } from '../../environments/environment';

export interface RespuestaStripe {
  exito: boolean;
  estadoApp: 'EXITO' | 'PENDIENTE' | 'FALLO';
  idTransaccion: string;
  estadoStripe: string;
  mensaje: string;
  referenciaOxxoSpei?: string;
}

@Injectable({
  providedIn: 'root',
})
export class StripeApiService {
  private readonly apiUrl = environment.stripe.apiUrl;
  private readonly secretKey = environment.stripe.secretKey;

  async crearIntentoPago(
    montoMxn: number,
    descripcion: string,
    numeroTarjeta: string,
    titular = '',
    metodoElegido: 'tarjeta' | 'oxxo' | 'spei' = 'tarjeta'
  ): Promise<RespuestaStripe> {
    // Flujo para métodos diferidos soportados en México (OXXO / SPEI)
    if (metodoElegido === 'oxxo') {
      return {
        exito: true,
        estadoApp: 'PENDIENTE',
        idTransaccion: 'pi_test_oxxo_' + Math.floor(100000000 + Math.random() * 900000000),
        estadoStripe: 'requires_action',
        referenciaOxxoSpei: '9300-1842-9910-4421',
        mensaje: 'Se generó tu ficha de pago OXXO mediante Stripe Sandbox.',
      };
    }

    if (metodoElegido === 'spei') {
      return {
        exito: true,
        estadoApp: 'PENDIENTE',
        idTransaccion: 'pi_test_spei_' + Math.floor(100000000 + Math.random() * 900000000),
        estadoStripe: 'requires_action',
        referenciaOxxoSpei: '646180157042819012',
        mensaje: 'Se generó tu cuenta CLABE SPEI mediante Stripe Sandbox.',
      };
    }

    const limpia = numeroTarjeta.replace(/\s+/g, '');
    const ultimos4 = limpia.slice(-4);
    const titularUpper = titular.trim().toUpperCase();

    // Tarjeta pendiente de validación en modo Sandbox
    if (ultimos4 === '0000' || titularUpper === 'CONT') {
      return {
        exito: true,
        estadoApp: 'PENDIENTE',
        idTransaccion: 'pi_test_' + Math.floor(100000000 + Math.random() * 900000000),
        estadoStripe: 'processing',
        mensaje: 'Tu pago se encuentra en proceso de validación bancaria (Stripe Sandbox).',
      };
    }

    // Mapeo de tarjetas de prueba oficiales de Stripe 
    const esDeclinada =
      limpia.startsWith('4000') ||
      ultimos4 === '0002' ||
      ultimos4 === '4111' ||
      titularUpper === 'OTHE' ||
      titularUpper === 'FUND';

    const paymentMethod = esDeclinada ? 'pm_card_chargeDeclined' : 'pm_card_visa';

   
    if (!this.secretKey || this.secretKey.includes('TU_LLAVE')) {
      if (paymentMethod === 'pm_card_chargeDeclined') {
        return {
          exito: false,
          estadoApp: 'FALLO',
          idTransaccion: '',
          estadoStripe: 'requires_payment_method',
          mensaje: 'Tu tarjeta fue declinada por el banco emisor (Stripe Sandbox).',
        };
      }
      return {
        exito: true,
        estadoApp: 'EXITO',
        idTransaccion: 'pi_test_' + Math.floor(100000000 + Math.random() * 900000000),
        estadoStripe: 'succeeded',
        mensaje: 'Pago confirmado vía Stripe Sandbox.',
      };
    }

    // Petición HTTP real a Stripe PaymentIntents API con CapacitorHttp
    const montoCentavos = Math.max(1000, Math.round(montoMxn * 100));
    const body = new URLSearchParams({
      amount: String(montoCentavos),
      currency: 'mxn',
      payment_method: paymentMethod,
      confirm: 'true',
      description: descripcion,
      'automatic_payment_methods[enabled]': 'true',
      'automatic_payment_methods[allow_redirects]': 'never',
    }).toString();

    try {
      const response = await CapacitorHttp.post({
        url: this.apiUrl,
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: body,
      });

      const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;

      if (response.status >= 200 && response.status < 300 && data?.status === 'succeeded') {
        return {
          exito: true,
          estadoApp: 'EXITO',
          idTransaccion: data.id,
          estadoStripe: data.status,
          mensaje: 'Pago aprobado por Stripe API.',
        };
      }

      if (response.status >= 200 && response.status < 300 && data?.status === 'processing') {
        return {
          exito: true,
          estadoApp: 'PENDIENTE',
          idTransaccion: data.id,
          estadoStripe: data.status,
          mensaje: 'Pago en validación por Stripe API.',
        };
      }

      return {
        exito: false,
        estadoApp: 'FALLO',
        idTransaccion: data?.id || data?.error?.payment_intent?.id || '',
        estadoStripe: data?.status || data?.error?.payment_intent?.status || 'failed',
        mensaje: data?.error?.message || 'Stripe rechazó el intento de pago.',
      };
    } catch {
      return {
        exito: false,
        estadoApp: 'FALLO',
        idTransaccion: '',
        estadoStripe: 'network_error',
        mensaje: 'No se pudo conectar con la API de Stripe.',
      };
    }
  }
}
