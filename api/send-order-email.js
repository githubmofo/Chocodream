import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const orderData = req.body;

    try {
        const { data, error } = await resend.emails.send({
            from: 'Chocodream Orders <onboarding@resend.dev>', // Change this to your verified domain later
            to: [process.env.OWNER_EMAIL || 'your-email@example.com'], // The user will likely want this to go to THEIR email
            subject: `New Order Received - ${orderData.orderNumber}`,
            html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #fff;">
          <div style="text-align: center; padding-bottom: 20px;">
            <h1 style="color: #6b4a2b; margin: 0;">ChocoDream</h1>
            <p style="color: #8d6e63; font-style: italic;">New Order Notification</p>
          </div>
          
          <div style="background-color: #fce4ec; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #c2185b; margin-top: 0;">Order #${orderData.orderNumber}</h2>
            <p style="margin: 5px 0;"><strong>Customer:</strong> ${orderData.customer.firstName} ${orderData.customer.lastName}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${orderData.customer.email}</p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> ${orderData.customer.phone}</p>
            <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${orderData.paymentMethod.toUpperCase()}</p>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="border-bottom: 2px solid #6b4a2b; padding-bottom: 5px; color: #6b4a2b;">Shipping Address</h3>
            <p style="margin: 5px 0;">${orderData.customer.address}, ${orderData.customer.city}, ${orderData.customer.pincode}</p>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="border-bottom: 2px solid #6b4a2b; padding-bottom: 5px; color: #6b4a2b;">Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #fdf5e6;">
                  <th style="padding: 10px; text-align: left; border-bottom: 1px solid #eee;">Item</th>
                  <th style="padding: 10px; text-align: center; border-bottom: 1px solid #eee;">Qty</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 1px solid #eee;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${Object.values(orderData.items).map(item => `
                  <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
                    <td style="padding: 10px; text-align: center; border-bottom: 1px solid #eee;">${item.quantity}</td>
                    <td style="padding: 10px; text-align: right; border-bottom: 1px solid #eee;">$${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Subtotal</td>
                  <td style="padding: 10px; text-align: right;">$${orderData.totals.subtotal.toFixed(2)}</td>
                </tr>
                ${orderData.totals.discount > 0 ? `
                <tr>
                  <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold; color: #2e7d32;">Discount</td>
                  <td style="padding: 10px; text-align: right; color: #2e7d32;">-$${orderData.totals.discount.toFixed(2)}</td>
                </tr>
                ` : ''}
                <tr>
                  <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Shipping</td>
                  <td style="padding: 10px; text-align: right;">${orderData.totals.shipping === 0 ? 'FREE' : `$${orderData.totals.shipping.toFixed(2)}`}</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">GST (18%)</td>
                  <td style="padding: 10px; text-align: right;">$${orderData.totals.gst.toFixed(2)}</td>
                </tr>
                <tr style="background-color: #6b4a2b; color: white;">
                  <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Grand Total</td>
                  <td style="padding: 10px; text-align: right; font-weight: bold;">$${orderData.totals.total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div style="text-align: center; font-size: 12px; color: #777; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
            <p>This is an automated notification from ChocoDream Store.</p>
          </div>
        </div>
      `,
        });

        if (error) {
            return res.status(400).json({ error });
        }

        res.status(200).json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
