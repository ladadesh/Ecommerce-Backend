const nodemailer = require('nodemailer')


const sendEmail = async options => {
    const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "9353e6fdb679ea",
          pass: "5dd8b0659fc0ec"
        }
      });

    const message = {
        from : `AmazonClone <noreply@amazonclone.com>`,
        to : options.email ,
        subject : options.subject,
        text : options.message
    }  

     await transporter.sendMail(message)

}

module.exports = sendEmail