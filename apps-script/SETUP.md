# Connect the website forms

When someone fills in the Contact form (contact.html) or Franchise form (franchise.html):

1. the enquiry is saved in a Google Sheet,
2. it is emailed to **sales@golaban.com** (your Zoho inbox). Press **Reply** in Zoho and it goes straight to the customer, and
3. the customer **automatically gets a branded thank-you email from sales@golaban.com**. Nobody has to do anything. (This only happens if they typed their email in the form.)

---

## Part A: Forms → Sheet → Zoho inbox (5 min)

1. Sign in to Google with the account that should own the enquiries, and create a Google Sheet named **Go Laban – Website Enquiries**.
2. In the sheet, open **Extensions → Apps Script**. Delete the sample code, paste in everything from `Code.gs`, and click **Save**.
3. Pick `testSetup` from the function list at the top and click **Run**. Approve the permissions when Google asks. A test enquiry arrives in Zoho, and a sample thank-you email arrives too, because the test sends one to sales@golaban.com.
4. Click **Deploy → New deployment**, then:
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**

   Click **Deploy** and copy the **Web app URL**. It ends in `/exec`.
5. Open `js/config.js` on the website and paste the URL between the quotes:

   ```js
   FORM_ENDPOINT: "https://script.google.com/macros/s/XXXXXXXX/exec",
   ```

6. Upload the site and send yourself a test from contact.html.

At this point automatic replies already work. They show **Go Laban** as the sender name and replies go to sales@golaban.com. But the address the customer sees is still the Google account. Part B fixes that.

---

## Part B: Send the automatic reply FROM sales@golaban.com via Zoho (10 min, recommended)

This lets Gmail send as sales@golaban.com through Zoho's mail server. Customers see `Go Laban <sales@golaban.com>`, and the email is less likely to land in spam.

**B1. Create a Zoho app password**
1. Sign in at **accounts.zoho.in** (or accounts.zoho.com if your Zoho account is on .com) as sales@golaban.com.
2. Go to **Security → App Passwords → Generate New Password**, name it `Gmail send-as`, and copy the password.

**B2. Add sales@golaban.com to the Google account that owns the script**
1. Open **Gmail → Settings (gear) → See all settings → Accounts and Import**.
2. Under **Send mail as**, click **Add another email address**.
   - Name: `Go Laban`
   - Email: `sales@golaban.com`
   - Click **Next Step**.
3. Fill in the SMTP details:
   | Field | Value |
   |---|---|
   | SMTP Server | `smtp.zoho.in` (use `smtp.zoho.com` if your Zoho account is on .com) |
   | Port | `465` |
   | Username | `sales@golaban.com` |
   | Password | the app password from B1 |
   | | ● Secured connection using **SSL** |
4. Click **Add Account**. Gmail emails a confirmation code to sales@golaban.com. Open Zoho Mail, copy the code, and paste it into Gmail to verify.

**B3. Check it**
- In Apps Script, run `testSetup` again. Under **View → Logs** (or the Execution log), you should see `Send-as sales@golaban.com ready: true`.
- That's it. You don't need to redeploy; the script detects the address automatically.

---

## Good to know

- **Customers who leave the email blank** don't get an automatic reply. You still get the enquiry with their phone number and a one-tap WhatsApp link.
- The **Auto-reply** column in the sheet shows what happened for each enquiry: `Sent from sales@golaban.com`, `Sent (reply-to …)`, `No email given`, or `Failed: …`.
- **Turn auto-replies off:** set `AUTO_REPLY = false` at the top of `Code.gs`.
- **Change the wording:** edit the `sendAutoReply_` function in `Code.gs` (the `intro` text and the email layout).
- **Daily limit:** a free Gmail account can send about 100 automatic emails a day, and Google Workspace about 1,500. That's plenty for website enquiries.
- **The logo in the email** loads from `https://golaban.com/assets/logo.png`, so upload the site before testing.
- **After editing `Code.gs`:** go to **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**. The URL stays the same.
