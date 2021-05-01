const Welcome = (name) => {
  // console.log(name);

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Welcome to Stremio</title>
      <style type="text/css">
        body {
          margin: 0;
          padding: 0;
          background-color: #f6f9fc;
          text-align:center;
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
          font-family: Helvetica Neue;
          color: #4a4a4a;
        }
        .Button {
          font: inherit;
          margin: 0;
          outline: 0;
          border-radius: 100px;
          box-shadow: none;
          font-size: 20px;
          font-weight: bold;
          line-height: 20px;
          padding: 10px 20px;
          text-align: center;
          background: linear-gradient(45deg, #f046ff, #9b00e8);
          border: none;
          color: aquamarine;
          cursor: pointer;
          margin-top: 10px;
          margin-bottom: 25px;
        }
        .Account-span-bold {
          background: rgb(236, 238, 247);
          padding: 10px;
          text-align: right;
          font-weight: bold;
        }
        .Account-span {
          background: rgb(236, 238, 247);
          padding: 10px;
          text-align: left;
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
                <table width="100%" style="border-spacing: 0">
                  <tr>
                    <td
                      style="
                        background-image: linear-gradient(
                          45deg,
                          #f046ff,
                          #9b00e8
                        );
                        padding: 10px;
                        text-align: center;
                      "
                    >
                      <p
                        style="
                          font-size: 30px;
                          color: aquamarine;
                          margin-bottom: 13px;
                          font-weight: 500;
                        "
                      >
                        Welcome to Stremio !
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <a href="#"
                  ><img
                    src="https://i.imgur.com/LeRBiPK.png"
                    alt="Stremio logo"
                    title="Stremio Logo"
                    width="600"
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
                        padding: 10px 10px 0 10px;
                        text-align: center;
                      "
                    >
                      <p
                        style="
                          font-size: 22px;
                          color: rgb(59, 53, 53);
                          margin-bottom: 0;
                        "
                      >
                        ${name},
                      </p>
                    </td>
                  </tr>
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
                          font-size: 22px;
                          color: rgb(59, 53, 53);
                          margin-bottom: 13px;
                        "
                      >
                        Congratulations! You're a Stremian now. <br />
                        Just click the button below to start Bingeing.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="
                        background: #ffffff;
                        padding: 0 10px;
                        text-align: center;
                      "
                    >
                      <a href="https://stremiovid.herokuapp.com"
                        ><button type="submit" class="Button">
                          let's start Streaming...
                        </button></a
                      >
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
  
            <tr>
              <td>
                <table width="100%" style="border-spacing: 0; text-align: center">
                  <tr>
                    <td
                      style="
                        background: #ffffff;
                        padding: 10px 10px 0 30px;
                        text-align: center;
                      "
                    >
                      <p
                        style="
                          font-size: 26px;
                          color: #e73540;
                          margin-bottom: 10;
                          font-weight: bolder;
                        "
                      >
                        What's Stremio About?
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table
                        width="480px"
                        style="
                          border-spacing: 0;
                          position: relative;
                          left: 60px;
                          margin-bottom: 20px;
                        "
                      >
                        <tr style="text-align: center; padding-left: 30%">
                          <td
                            style="
                              background: #b01e28;
                              padding: 10px 10px 10px 60px;
                              text-align: center;
                            "
                          >
                            <p
                              style="
                                font-size: 20px;
                                color: #fff;
                                margin-bottom: 13px;
                                text-align: center;
                                font-family: Georgia, 'Times New Roman', Times,
                                  serif;
                              "
                            >
                              Stremio is a video sharing platform. Stremio
                              provides an interactive and attractive platform
                              where user can watch videos from different users and
                              log in with their accounts to upload videos freely
                              and securely.
                            </p>
                          </td>
                        </tr>
                      </table>
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
                        background-image: linear-gradient(
                          45deg,
                          #f046ff,
                          #9b00e8
                        );
                        padding: 15px;
                        text-align: center;
                      "
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
                        <a
                          href="#"
                          style="text-decoration: none; color: aquamarine"
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

module.exports = { Welcome };
