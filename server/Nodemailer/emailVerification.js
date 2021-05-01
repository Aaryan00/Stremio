const EmailVerification = (otp) => {
  // console.log(otp);

  return `
    <!DOCTYPE html>
    <html style="margin: 0; padding: 0;">
    
        <head>
            <title>Hello</title>
        </head>
    
        <body style="margin: 0; padding: 0">
        <div style="margin: auto; padding-left: 10%">
          <div style="text-align: center; position: absolute">
            <br />
            <br />
            <a href="#"
              ><img
                src="https://i.imgur.com/LeRBiPK.png"
                alt="Stremio logo"
                title="Stremio Logo"
                width="600"
            /></a>
            <div style="text-align: left; position: relative">
              <div>
                We have received a request for email verify , click this link to
                Verify your email
                <a href="https://pumpkin-cupcake-09736.herokuapp.com/api/users/${otp}">Click here</a>
              </div>
              <br />
              <br />
              if this link doesn't work then paste the below link in your browser
              <br />
              <b>https://pumpkin-cupcake-09736.herokuapp.com/api/users/${otp}</b>
            </div>
          </div>
        </div>
      </body>
    
      </html>

        `;
};

module.exports = { EmailVerification };
