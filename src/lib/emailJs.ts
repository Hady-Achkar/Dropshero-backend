import * as dotenv from 'dotenv'
import nodemailer from 'nodemailer'
dotenv.config()

/**
 * @description
 *  Sends an email
 * @param {string} toName
 * @param {string} toEmail
 * @param {string} subject
 * @param {string} text
 * @returns void
 */
const sendEmail = async (
	toName: string,
	toEmail: string,
	subject: string,
	text: string
) => {
	try {
		let transporter = nodemailer.createTransport({
			host: 'mail.privateemail.com',
			port: 587,
			secure: false,
			auth: {
				user: 'notification@easyecommerce.io', // generated ethereal user
				pass: 'Easyecomteam123!', // generated ethereal password
			},
		})
		await transporter.sendMail({
			from: 'Easyecommerce.io <notification@easyecommerce.io>', // sender address
			to: `${toEmail}`, // list of receivers
			subject: `${subject}`, // Subject line
			html: `<html lang='en' xmlns='http://www.w3.org/1999/xhtml' xmlns:v='urn:schemas-microsoft-com:vml' xmlns:o='urn:schemas-microsoft-com:office:office'>
            <head>
                <meta charset='utf-8'> <!-- utf-8 works for most cases -->
                <meta name='viewport' content='width=device-width'> <!-- Forcing initial-scale shouldn't be necessary -->
                <meta http-equiv='X-UA-Compatible' content='IE=edge'> <!-- Use the latest (edge) version of IE rendering engine -->
                <meta name='x-apple-disable-message-reformatting'>  <!-- Disable auto-scale in iOS 10 Mail entirely -->
                <title>Reset Your Password</title> <!-- The title tag shows in email notifications, like Android 4.4. -->
                <link href='https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700' rel='stylesheet'>
            </head>
        
            <body width='100%' style='margin: 0; padding: 0 !important; mso-line-height-rule: exactly;'>
                <center style='width: 100%;'>
                <div style='max-width: 600px; margin: 0 auto;' class='email-container'>
                    <!-- BEGIN BODY -->
                  <table align='center' role='presentation' cellspacing='0' cellpadding='0' border='0' width='100%' style='margin: auto;'>
                      <tr>
                      <td valign='top' class='bg_white' style='padding: 1em 2.5em 0 2.5em;'>
                          <table role='presentation' border='0' cellpadding='0' cellspacing='0' width='100%'>
                              <tr>
                                  <td class='logo' style='text-align: center;'>
                                    <p><a href='https://easyecommerce.io'>Easyecommerce.io</a></p>
                                  </td>
                              </tr>
                          </table>
                      </td>
                      </tr><!-- end tr -->
                            <tr>
                      <td valign='middle' class='hero bg_white' style='padding: 2em 0 4em 0;'>
                        <table role='presentation' border='0' cellpadding='0' cellspacing='0' width='100%'>
                            <tr>
                                <td style='padding: 0 2.5em; text-align: center; padding-bottom: 3em;'>
                                    <div class='text'>
                                        <h2>Reset Your Password</h2>
                                        <p>We received a request to reset your password for your Easyecommerce.io account. Please click the button below to proceed.</p>
                                        ${text}
                                        <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
                                    </div>
                                </td>
                            </tr>
                        </table>
                      </td>
                      </tr><!-- end tr -->
                  <!-- 1 Column Text + Button : END -->
                  </table>
        
                </div>
              </center>
            </body>
            </html>`, // html body
		})
	} catch (error) {
		return console.log(error)
	}
}
export default sendEmail
