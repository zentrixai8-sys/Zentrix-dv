
/**
 * ZENTRIX SYSTEM BACKEND SCRIPT
 * 1. Log in to zentrix.ai8@gmail.com
 * 2. Go to script.google.com -> New Project
 * 3. Paste this code and Deploy as Web App (Access: Anyone)
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheetId = '1wGMehA9CpOkdGqe_QXM0WkkkVdRl61-PDj3br33y1ME';
    var ss = SpreadsheetApp.openById(sheetId);
    
    // Check which sheet to use
    var sheetName = data.sheet || 'demo book';
    var sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": "Sheet not found: " + sheetName}))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var timestamp = new Date();

    if (sheetName === 'demo book') {
      // Data Mapping: [NAME, NUMNER, BUSINESS EMAIL, NOTES, TIMESTAMP]
      sheet.appendRow([
        data.NAME, 
        data.NUMNER, 
        data['BUSINESS EMAIL'], 
        data.NOTES, 
        timestamp
      ]);

      // --- EMAIL NOTIFICATIONS ---
      
      // 1. Notification to ADMIN (dstar95826@gmail.com)
      var adminEmail = "dstar95826@gmail.com";
      var adminSubject = "🚀 New Demo Request: " + data.NAME;
      var adminBody = "ZENTRIX Core has received a new inquiry.\n\n" +
                      "--------------------------------------\n" +
                      "Customer Name : " + data.NAME + "\n" +
                      "Phone Number  : " + data.NUMNER + "\n" +
                      "Email Address : " + data['BUSINESS EMAIL'] + "\n" +
                      "Inquiry Details: " + data.NOTES + "\n" +
                      "--------------------------------------\n" +
                      "Timestamp: " + timestamp + "\n" +
                      "Action: Please contact the lead within 2 hours.";
      
      GmailApp.sendEmail(adminEmail, adminSubject, adminBody);

      // 2. Thank You Mail to CLIENT
      var clientEmail = data['BUSINESS EMAIL'];
      var clientSubject = "Thank you for reaching out to ZENTRIX";
      var clientBody = "Dear " + data.NAME + ",\n\n" +
                       "Thank you for your interest in ZENTRIX Automation OS. Your request for a technical demonstration has been received.\n\n" +
                       "One of our system architects will contact you shortly at " + data.NUMNER + " to schedule your session.\n\n" +
                       "Best Regards,\n" +
                       "Support Team | ZENTRIX\n" +
                       "Website: https://zentrix-dv.com";

      GmailApp.sendEmail(clientEmail, clientSubject, clientBody);
    } 
    else if (sheetName === 'ADS') {
      // Data Mapping for Ads: [CONTENT, IMAGE URL, LINK, TIMESTAMP]
      sheet.appendRow([
        data.CONTENT, 
        data['IMAGE URL'], 
        data.link, 
        timestamp
      ]);
    }
    else {
      // Generic fallback for other sheets like 'admin' or 'settings' if needed
      var keys = Object.keys(data).filter(function(k) { return k !== 'sheet'; });
      var row = keys.map(function(k) { return data[k]; });
      row.push(timestamp);
      sheet.appendRow(row);
    }

    return ContentService.createTextOutput(JSON.stringify({"status": "success"}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: Handle GET requests to fetch data from sheets
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
