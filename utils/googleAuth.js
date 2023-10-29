const { OAuth2Client } = require('google-auth-library')

const client = new OAuth2Client(
  '736115768308-77jadpfo2mp1qp7uq8fee01i14k6o8mp.apps.googleusercontent.com',
  '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',
  /**
   * To get access_token and refresh_token in server side,
   * the data for redirect_uri should be postmessage.
   * postmessage is magic value for redirect_uri to get credentials without actual redirect uri.
   */
  'postmessage'
)

exports.getProfileInfo = async code => {
  const r = await client.getToken(code)
  const idToken = r.tokens.id_token

  const ticket = await client.verifyIdToken({
    idToken,
    audience:
      '736115768308-77jadpfo2mp1qp7uq8fee01i14k6o8mp.apps.googleusercontent.com'
  })

  const payload = ticket.getPayload()

  return payload
}
