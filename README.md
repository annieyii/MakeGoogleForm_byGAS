# MakeGoogleForm_byGAS

This project automates the creation of **Google Forms** using data from **Google Sheets** with **Google Apps Script (GAS)**.

## How to use
1. Prepare a **Google Drive folder** and upload all required images.
2. Create a **Google Sheet** with the following format:

| Question Index | Image 1 Filename | Image 2 Filename |
|--------------|----------------|----------------|
| 1 | image1.jpg | image2.jpg |
| 2 | image3.jpg | image4.jpg |

  - Each row represents a single question.
  - The first column contains the question index.
  - The second and third columns contain image filenames (must match the uploaded files in Drive).

3. Run the script in Google Apps Script:
   - Replace placeholders: `yoursheetID`, `imagefolderID`, `targetfolderID`.
   - The script will generate multiple Google Forms, each containing a set of questions with images.
   - Forms will be automatically stored in the specified Drive folder.
