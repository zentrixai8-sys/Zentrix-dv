
/**
 * ZENTRIX DATA LOGGING SCRIPT (Storage Only - No Emails)
 * 1. Log in to zentrix.ai8@gmail.com
 * 2. Go to script.google.com -> New Project
 * 3. Paste this code and Deploy as Web App (Access: Anyone)
 * 4. Ensure you grant "Sheets" permissions during deployment.
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheetId = '1wGMehA9CpOkdGqe_QXM0WkkkVdRl61-PDj3br33y1ME';
    var ss = SpreadsheetApp.openById(sheetId);
    
    // Determine target sheet
    var sheetName = data.sheet || 'demo book';
    var sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": "Sheet not found"}))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var timestamp = new Date();

    if (sheetName === 'demo book') {
      // Record Form Data: [NAME, NUMBER, EMAIL, NOTES, TIMESTAMP]
      sheet.appendRow([
        data.NAME, 
        data.NUMNER, 
        data['BUSINESS EMAIL'], 
        data.NOTES, 
        timestamp
      ]);
    } 
    else if (sheetName === 'ADS') {
      // Record Ad Data: [CONTENT, IMAGE URL, LINK, TIMESTAMP]
      sheet.appendRow([
        data.CONTENT, 
        data['IMAGE URL'], 
        data.link, 
        timestamp
      ]);
    }
    else {
      // Generic row append for other sheets
      var keys = Object.keys(data).filter(function(k) { return k !== 'sheet'; });
      var row = keys.map(function(k) { return data[k]; });
      row.push(timestamp);
      sheet.appendRow(row);
    }

    // Success response to frontend
    return ContentService.createTextOutput(JSON.stringify({"status": "success"}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests to fetch data (Banners, Testimonials, Settings)
 */
function doGet(e) {
  try {
    var sheetName = e.parameter.sheet || 'ADS';
    var ss = SpreadsheetApp.openById('1wGMehA9CpOkdGqe_QXM0WkkkVdRl61-PDj3br33y1ME');
    var sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var values = sheet.getDataRange().getValues();
    if (values.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
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
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({"error": err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
