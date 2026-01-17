
/**
 * ZENTRIX SYSTEM BACKEND SCRIPT (V2 - Premium HTML Emails)
 * 1. Log in to zentrix.ai8@gmail.com
 * 2. Go to script.google.com -> New Project
 * 3. Paste this code and Deploy as Web App (Access: Anyone)
 * 4. IMPORTANT: When deploying, grant permissions for Gmail and Sheets.
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheetId = '1wGMehA9CpOkdGqe_QXM0WkkkVdRl61-PDj3br33y1ME';
    var ss = SpreadsheetApp.openById(sheetId);
    
    var sheetName = data.sheet || 'demo book';
    var sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": "Sheet not found"}))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var timestamp = new Date();
    var formattedDate = Utilities.formatDate(timestamp, "GMT+5:30", "dd MMM yyyy, HH:mm:ss");

    if (sheetName === 'demo book') {
      // 1. Record in Sheet
      sheet.appendRow([
        data.NAME, 
        data.NUMNER, 
        data['BUSINESS EMAIL'], 
        data.NOTES, 
        timestamp
      ]);

      // --- EMAIL NOTIFICATIONS (HTML DRAFTS) ---
      
      var adminEmail = "dstar95826@gmail.com";
      var clientEmail = data['BUSINESS EMAIL'];
      var senderName = "ZENTRIX Core";

      // --- ADMIN NOTIFICATION DESIGN ---
      var adminHtmlBody = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #050505; color: #ffffff; padding: 40px; border-radius: 20px;">
          <div style="border-bottom: 1px solid #222; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="color: #06b6d4; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">🚀 New High-Priority Lead</h1>
            <p style="color: #666; font-size: 12px; margin-top: 5px;">ZENTRIX INBOUND PROTOCOL v2.5</p>
          </div>
          
          <div style="background-color: #0a0a0a; border: 1px solid #1a1a1a; padding: 25px; border-radius: 15px; margin-bottom: 30px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="color: #06b6d4; font-weight: bold; width: 140px; padding: 10px 0;">CLIENT NAME:</td>
                <td style="color: #eee; padding: 10px 0;">${data.NAME}</td>
              </tr>
              <tr>
                <td style="color: #06b6d4; font-weight: bold; padding: 10px 0;">PHONE:</td>
                <td style="color: #eee; padding: 10px 0;">${data.NUMNER}</td>
              </tr>
              <tr>
                <td style="color: #06b6d4; font-weight: bold; padding: 10px 0;">EMAIL:</td>
                <td style="color: #eee; padding: 10px 0;">${data['BUSINESS EMAIL']}</td>
              </tr>
              <tr>
                <td style="color: #06b6d4; font-weight: bold; padding: 10px 0;">INQUIRY:</td>
                <td style="color: #eee; padding: 10px 0;">${data.NOTES}</td>
              </tr>
            </table>
          </div>
          
          <div style="color: #555; font-size: 11px; text-align: center;">
            <p>Received at: ${formattedDate} (IST)</p>
            <p>Protocol: AUTO_LOG_SHEET_RECORDED</p>
          </div>
        </div>
      `;

      // --- CLIENT THANK YOU DESIGN ---
      var clientHtmlBody = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #ffffff; color: #1a1a1a; padding: 40px; border: 1px solid #eee; border-radius: 20px; max-width: 600px; margin: auto;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-weight: 900; letter-spacing: -1px; margin: 0; font-size: 32px; color: #000;">ZEN<span style="color: #06b6d4;">TRIX</span></h1>
            <p style="color: #06b6d4; font-weight: bold; font-size: 10px; text-transform: uppercase; letter-spacing: 4px; margin-top: 5px;">Automation OS</p>
          </div>
          
          <h2 style="font-size: 22px; font-weight: 800; color: #000; margin-bottom: 20px;">Protocol Initialized, ${data.NAME}.</h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #444; margin-bottom: 30px;">
            Thank you for reaching out to ZENTRIX. Your request for an enterprise automation demonstration has been successfully logged into our core system.
          </p>
          
          <div style="background-color: #f8fafc; border-left: 4px solid #06b6d4; padding: 20px; margin-bottom: 30px;">
            <p style="margin: 0; font-weight: bold; font-size: 14px; color: #1e293b;">Next Steps:</p>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #475569;">Our technical architect will review your inquiry and contact you at <b>${data.NUMNER}</b> within the next 2 business hours to schedule your demo.</p>
          </div>
          
          <div style="text-align: center; border-top: 1px solid #eee; padding-top: 30px;">
            <p style="font-size: 12px; color: #94a3b8; margin-bottom: 5px;">System generated message by ZENTRIX CORE</p>
            <p style="font-size: 12px; font-weight: bold; color: #000;">Raipur, Chhattisgarh, India</p>
          </div>
        </div>
      `;

      // Send Admin Email
      MailApp.sendEmail({
        to: adminEmail,
        subject: "🚀 NEW LEAD: " + data.NAME + " (ZENTRIX)",
        name: senderName,
        htmlBody: adminHtmlBody
      });

      // Send Client Email
      MailApp.sendEmail({
        to: clientEmail,
        subject: "Welcome to ZENTRIX | Demo Protocol Initialized",
        name: senderName,
        htmlBody: clientHtmlBody
      });
    } 
    else if (sheetName === 'ADS') {
      sheet.appendRow([data.CONTENT, data['IMAGE URL'], data.link, timestamp]);
    }

    return ContentService.createTextOutput(JSON.stringify({"status": "success"}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  var sheetName = e.parameter.sheet || 'ADS';
  var ss = SpreadsheetApp.openById('1wGMehA9CpOkdGqe_QXM0WkkkVdRl61-PDj3br33y1ME');
  var sheet = ss.getSheetByName(sheetName);
  var values = sheet.getDataRange().getValues();
  var headers = values[0];
  var data = [];
  
  for (var i = 1; i < values.length; i++) {
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = values[i][j];
    }
    data.push(obj);
  }
  
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
