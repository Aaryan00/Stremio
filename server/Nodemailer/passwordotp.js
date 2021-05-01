const Otpchange = (otp) => {
  // console.log(otp);

  return `
    <!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>w3newbie HTML Email</title>
    <style type="text/css">
      body {
        margin: 0;
        padding: 0;
        background-color: #f6f9fc;
      }
      table {
        border-spacing: 0;
      }
      td {
        padding: 0;
      }
      img {
        border: 0;
      }
      .wrapper {
        width: 100%;
        table-layout: fixed;
        background-color: #f6f9fc;
        padding-bottom: 40px;
      }
      .webkit {
        max-width: 600px;
        background-color: #ffffff;
      }
      .outer {
        margin: 0 auto;
        width: 100%;
        max-width: auto;
        border-spacing: 0;
        font-family: Helvetica;
        color: #4a4a4a;
      }
      .logo {
        direction: ltr;
        font: Arial, Helvetica, sans-serif;
        font-family: Roboto, RobotoDraft, Helvetica, Arial, sans-serif;
        line-height: 3px;
        font-size: 5px;
        color: #15c;
        float: right;
        vertical-align: top;
        width: 150px;
        margin: 0;
        padding: 15px 15px 0 0;
        border: none;
        outline: none;
      }

      @media screen and (max-width: 600px) {
      }
      @media screen and (max-width: 400px) {
      }
    </style>
  </head>
  <body>
    <center class="wrapper">
      <div class="webkit">
        <table class="outer" align="center">
          <tr>
            <td>
              <a href="#"
                ><img
                  src="https://i.imgur.com/LeRBiPK.png"
                  class="logo"
                  alt="Stremio logo"
              /></a>
            </td>
          </tr>
          <tr>
            <td>
              <table width="100%" style="border-spacing: 0">
                <tr>
                  <td
                    style="
                      background: #ffffff;
                      padding: 10px 10px 0 30px;
                      text-align: left;
                    "
                  >
                    <p
                      style="
                        font-size: 40px;
                        color: #1422e7;
                        margin-bottom: 13px;
                        font-weight: bolder;
                      "
                    >
                      Reset your password?
                    </p>
                  </td>
                </tr>
                <tr>
                  <td
                    style="
                      background: #ffffff;
                      padding: 10px 10px 0 30px;
                      text-align: left;
                    "
                  >
                    <p
                      style="
                        font-size: 20px;
                        color: rgb(59, 53, 53);
                        margin-bottom: 13px;
                      "
                    >
                      If you requested a password reset for your stremio account, use the
                      confirmation code below to complete the process. If you
                      didn't make this request, ignore this email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td>
              <table width="100%" style="border-spacing: 0">
                <tr>
                  <td
                    style="
                      background: #ffffff;
                      padding: 10px 10px 0 10px;
                      text-align: center;
                    "
                  >
                    <p
                      style="
                        font-size: 20px;
                        color: rgb(59, 53, 53);
                        margin-bottom: 0;
                        font-weight: bold;
                      "
                    >
                      ${otp}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td>
              <table width="100%" style="border-spacing: 0">
                <tr>
                  <td
                    style="
                      background: #ffffff;
                      padding: 10px 10px 0 30px;
                      text-align: left;
                    "
                  >
                    <p
                      style="
                        font-size: 27px;
                        color: #e73540;
                        margin-bottom: 10;
                        font-weight: bolder;
                      "
                    >
                      Getting a lot of password reset emails?
                    </p>
                    <p
                      style="
                        font-size: 20px;
                        color: rgb(59, 53, 53);
                        margin-bottom: 13px;
                      "
                    >
                      You can change your
                      <span style="color: rgb(33, 189, 93)">
                        account settings</span
                      >
                      to require personal information to reset your password.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td>
              <table width="100%" style="border-spacing: 0">
                <tr>
                  <td
                    style="background: #fff; padding: 15px; text-align: center"
                  >
                    <p
                      style="
                        font-size: 18px;
                        color: #551a8b;
                        margin-bottom: 13px;
                        font-family: Georgia, 'Times New Roman', Times, serif;
                        font-weight: bolder;
                      "
                    >
                      <a href="#" style="text-decoration: none; color: #388cda"
                        >@A.A.A</a
                      >
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    </center>
  </body>
</html>
      `;
};

module.exports = { Otpchange };
