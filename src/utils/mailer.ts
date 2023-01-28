import nodemailer, { SendMailOptions } from "nodemailer"
import log from "./logger"
import config from "config"

const smtp = config.get<{
  user: string,
  pass: string,
  host: string,
  port: number,
  secure: boolean
}>('smtp')

const transporter = nodemailer.createTransport({...smtp, auth: {
  user: smtp.user,
  pass: smtp.pass,
}})

async function sendMail(payload: SendMailOptions) {
  transporter.sendMail(payload, (err, info) => {
    if (err) {
      log.error(err)
    }
    log.info(nodemailer.getTestMessageUrl(info))
  })
}

export default sendMail
