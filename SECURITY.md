
# Reporting a Security Bug
      
All security bugs in AmpersandJS are taken seriously and should be reported by email to **[security@ampersandjs.com](mailto:security@ampersandjs.com)**. This will be delivered to a subset of the core team who handle security issues.

Your email will be acknowledged within 24 hours, and you’ll receive a more detailed response to your email within 48 hours indicating the next steps in handling your report.

After the initial reply to your report, the security team will endeavor to keep you informed of the progress being made towards a fix and full announcement, and may ask for additional information or guidance surrounding the reported issue. These updates will be sent at least every five days, in practice, this is more likely to be every 24-48 hours.

If we have not responded promptly we ask that you give us the benefit of the doubt as it is possible the email went to spam or we have been so focused on something else we haven't seen it yet.  Please send us a quick message, *without detail* at one of the following.

- Contact the current security coordinator ([Adam Baldwin](mailto:baldwin@andyet.net)) directly.
- Give a heads up in the [chatroom](https://gitter.im/AmpersandJS/AmpersandJS)
- Message [@ampersandjs](https://twitter.com/ampersandjs) on twitter.

Security bugs in third party modules should be reported to their respective maintainers and can also be coordinated through the [Node Security Project](https://nodesecurity.io).

Thank you for improving the security of AmpersandJS. Your efforts and coordinated disclosure are greatly appreciated and will be acknowledged.


# Disclosure Policy

Here is the security disclosure policy for AmpersandJS

- The security report is received and is assigned a primary handler. This person will coordinate the fix and release process. The problem is confirmed and a list of all affected versions is determined. Code is audited to find any potential similar problems. Fixes are prepared for all releases which are still under maintenance. These fixes are not committed to the public repository but rather held locally pending the announcement.

- A suggested embargo date for this vulnerability is chosen and a CVE (Common Vulnerabilities and  Exposures (CVE®)) is requested for the vulnerability.

- On the embargo date, the Node Securty Project will publish the advisory. The changes are pushed to the public repository. 

- Typically the embargo date will be set 72 hours from the time the CVE is issued. However, this may vary depending on the severity of the bug or difficulty in applying a fix.

- This process can take some time, especially when coordination is required with maintainers of other projects. Every effort will be made to handle the bug in as timely a manner as possible, however, it’s important that we follow the release process above to ensure that the disclosure is handled in a consistent manner.


# Receiving Security Updates

Security notifications will be distributed via the following methods.

- A message will be posted in the [chatroom](https://gitter.im/AmpersandJS/AmpersandJS)
- A security advisory will be published at nodesecurity.io and will be identifiable by the [nsp](https://www.npmjs.org/package/nsp) utility.

# Comments on this Policy

If you have suggestions on how this process could be improved please submit a [pull request](https://github.com/AmpersandJS/ampersandjs.com) or email [security@ampersandjs.com](mailto:security@ampersandjs.com) to discuss.


# History

No security issues have been reported for this project yet.
