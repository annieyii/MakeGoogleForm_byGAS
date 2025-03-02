var questionsData = [];

/**
 * Initializes the dataset by fetching data from the specified Google Sheet.
 * This function reads the question descriptions, associated images, and predefined options.
 */
function initializeData() {
  var id = 'yoursheetID'; // // The ID of the Google Sheet where form responses are saved
  var spreadsheet = SpreadsheetApp.openById(id);
  var sheet = spreadsheet.getSheets()[0]; // Select the first sheet
  var data = getData(sheet.getDataRange().getValues());

  questionsData = data.map(row => {
    return {
      question: row[0], // Question text
      images: row.slice(1, 3), // Two image names
      options: ['1 - Extremely Dissimilar', '2', '3', '4 - Extremely Similar'] // Predefined answer choices
    }
  });

  Logger.log("Questions data initialized: " + JSON.stringify(questionsData));
}

/**
 * Generates a Google Form with the specified range of questions.
 * Each form includes the user's name, associated images, and a multiple-choice question.
 *
 * @param {number} startIndex - The starting index for the question range.
 * @param {number} endIndex - The ending index for the question range.
 * @param {string} formTitle - The title of the generated form.
 * @param {Folder} parentFolder - The target folder where the form will be stored.
 */
function generateForm(startIndex, endIndex, formTitle, parentFolder) {
  var formId = FormApp.create(formTitle).getId();
  var form = FormApp.openById(formId);
  
  form.setTitle(formTitle);
  form.setDescription("Thank you for filling out this form! Please make sure to review the guidelines before proceeding.");

  var folderId = 'imagefolderID';  // Folder ID where images are stored
  var folder = DriveApp.getFolderById(folderId);

  // Add a name input field as the first question
  form.addTextItem()
    .setTitle('Full Name')
    .setRequired(true);
  
  for (var i = startIndex; i < endIndex; i++) {
    var questionObj = questionsData[i];
    Logger.log("Processing question: " + JSON.stringify(questionObj));

    try {
      // Insert Image 1
      if (questionObj.images[0]) {
        var img1File = folder.getFilesByName(questionObj.images[0]);
        if (img1File.hasNext()) {
          var img1Blob = img1File.next().getBlob();
          form.addImageItem().setImage(img1Blob).setTitle("Image 1");
        } else {
          throw new Error("Image 1 not found: " + questionObj.images[0]);
        }
      } else {
        throw new Error("Image 1 is undefined for question: " + questionObj.question);
      }
    } catch (error) {
      Logger.log("Error processing Image 1 for question: " + questionObj.question + " - " + error.message);
    }

    try {
      // Insert Image 2
      if (questionObj.images[1]) {
        var img2File = folder.getFilesByName(questionObj.images[1]);
        if (img2File.hasNext()) {
          var img2Blob = img2File.next().getBlob();
          form.addImageItem().setImage(img2Blob).setTitle("Image 2");
        } else {
          throw new Error("Image 2 not found: " + questionObj.images[1]);
        }
      } else {
        throw new Error("Image 2 is undefined for question: " + questionObj.question);
      }
    } catch (error) {
      Logger.log("Error processing Image 2 for question: " + questionObj.question + " - " + error.message);
    }

    // Insert multiple-choice question
    try {
      var questionItem = form.addMultipleChoiceItem();
      questionItem.setTitle(questionObj.question).setRequired(true);
      questionItem.setChoices(questionObj.options.map(option => questionItem.createChoice(option)));
    } catch (error) {
      Logger.log("Error processing question choices for question: " + questionObj.question + " - " + error.message);
    }
  }

  // Move the generated form to the specified folder
  var formFile = DriveApp.getFileById(formId);
  parentFolder.addFile(formFile);
  DriveApp.getRootFolder().removeFile(formFile); // Remove the file from the root directory
}

/**
 * Creates multiple Google Forms and distributes the questions across them.
 * Each form contains a subset of the questions.
 */
function createForms() {
  if (questionsData.length === 0) initializeData();

  // adjust as you need 
  var totalForms = 27;
  var questionsPerForm = 100;

  var parentFolderId = 'targetfolderID'; 
  var parentFolder = DriveApp.getFolderById(parentFolderId);

  for (var i = 0; i < totalForms; i++) {
    var startIndex = i * questionsPerForm;
    var endIndex = 498; // Adjust as needed

    if (endIndex > questionsData.length) endIndex = questionsData.length; // last form

    var formTitle = "Questions " + (startIndex + 1) + " to " + endIndex;
    generateForm(startIndex, endIndex, formTitle, parentFolder);

    if (endIndex === questionsData.length) break;
  }
}

/**
 * Retrieves all data from a given sheet.
 * 
 * @param {Array} sheetData - The data range from the sheet.
 * @returns {Array} Processed data from the sheet.
 */
function getData(sheetData) {
  return sheetData.slice(0, sheetData.length); // Extracts all rows from the sheet
}
