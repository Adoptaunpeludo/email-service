export const petChanged = (webServiceUrl, link) => {
  return `
    <body width="100%" style="margin: 0 auto">
  <table
    width="90%"
    style="
      text-align: center;
      background-color: white;
      margin: auto auto;
      padding-top: 10%;
    "
  >
    <tr id="header" height="20%">
      <td style="padding-bottom: 5%">
        <img
          src="https://aup-s3images.s3.eu-west-3.amazonaws.com/logo.png"
          alt=""
          width="250px"
          height="auto"
        />
      </td>
    </tr>
    <tr id="main" height="60%">
      <td>
        <table width="100%">
          <tr>
            <td align="center" colspan="3">
              <h1
                style="
                  color: rgb(0, 0, 0);
                  font-family: 'Helvetica Neue', Helvetica, Arial, Verdana,
                    sans-serif;
                  font-size: 31px;
                  font-weight: bold;
                  line-height: 1.5;
                  text-align: left;
                  direction: ltr;
                  text-align: center;
                  margin: 0;
                "
              >
                Un peludo de tus favoritos
              </h1>
              <h1
                style="
                  color: rgb(0, 0, 0);
                  font-family: 'Helvetica Neue', Helvetica, Arial, Verdana,
                    sans-serif;
                  font-size: 31px;
                  font-weight: bold;
                  line-height: 1.5;
                  text-align: left;
                  direction: ltr;
                  text-align: center;
                  margin: 0;
                "
              >
                ¡Ha cambiado!
              </h1>
              <h2
                style="
                  color: rgb(0, 0, 0);
                  font-family: 'Helvetica Neue', Helvetica, Arial, Verdana,
                    sans-serif;
                  font-size: 16px;
                  font-weight: normal;
                  line-height: 1.5;
                  text-align: left;
                  direction: ltr;
                  text-align: center;
                "
              >
                Pulsa en el link para ver el peludo
              </h2>
            </td>
          </tr>
          <tr>
            <td width="33%"></td>
            <td width="33%">
              <a
                href="${webServiceUrl}/${link}"
                target="_blank"
                style="
                  background-color: #a5c73d;
                  border-radius: 18px;
                  border: 2px solid #a5c73d;
                  color: #000000;
                  display: block;
                  font-family: 'Raleway', sans-serif;
                  font-size: 16px;
                  font-weight: bold;
                  font-style: normal;
                  padding: 16px 28px;
                  text-decoration: none;
                  min-width: 30px;
                  text-align: center;
                  direction: ltr;
                  letter-spacing: 0px;
                "
                >Ver ficha del peludo</a
              >
            </td>
            <td width="33%"></td>
          </tr>
          
        </table>
      </td>
    </tr>
    <tr id="footer" height="20%">
      <td>
        <img
          src="https://aup-s3images.s3.eu-west-3.amazonaws.com/logo-mail.png"
          width="250px"
          height="auto"
          alt=""
          style="margin-top: 5rem"
        />
      </td>
    </tr>
    <tr id="footer" height="20%">
      <td
        style="
          color: rgb(0, 0, 0);
          font-family: 'Helvetica Neue', Helvetica, Arial, Verdana, sans-serif;
          font-size: 12px;
          font-weight: normal;
          line-height: 1.5;
          text-align: left;
          direction: ltr;
          text-align: center;
        "
      >
        Copyright (C) 2024 {JP:2} software. <br />Todos los derechos reservados.
      </td>
    </tr>
  </table>
</body>

    
    `;
};
