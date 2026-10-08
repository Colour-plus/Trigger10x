<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title>TRIGGER10X XML Sitemap</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style type="text/css">
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #1a202c;
            background-color: #f7fafc;
            margin: 0;
            padding: 30px 20px;
          }
          .container {
            max-width: 960px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            padding: 32px;
            border: 1px solid #e2e8f0;
          }
          .header {
            border-bottom: 2px solid #c9a86a;
            padding-bottom: 18px;
            margin-bottom: 24px;
          }
          h1 {
            color: #0d1217;
            font-size: 26px;
            margin: 0 0 8px 0;
            font-weight: 800;
            letter-spacing: -0.02em;
          }
          h1 span {
            color: #c9a86a;
          }
          p.desc {
            color: #718096;
            font-size: 14px;
            margin: 0;
            line-height: 1.5;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 16px;
          }
          th {
            background-color: #f8fafc;
            color: #4a5568;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            text-align: left;
            padding: 12px 14px;
            border-bottom: 1px solid #e2e8f0;
          }
          td {
            padding: 14px;
            border-bottom: 1px solid #edf2f7;
            font-size: 13.5px;
          }
          tr:hover td {
            background-color: #fbfbfa;
          }
          a {
            color: #0b0f14;
            text-decoration: none;
            font-weight: 600;
          }
          a:hover {
            color: #b88126;
            text-decoration: underline;
          }
          .badge {
            display: inline-block;
            background: #fef3c7;
            color: #92400e;
            padding: 3px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
          }
          .footer {
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid #edf2f7;
            font-size: 12px;
            color: #a0aec0;
            display: flex;
            justify-content: space-between;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>TRIGGER<span>10X</span> &middot; XML Sitemap</h1>
            <p class="desc">
              This XML Sitemap is generated for search engines like Google and Bing.
              It lists the primary crawlable pages of <a href="https://trigger10x.com/">trigger10x.com</a>.
            </p>
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 55%;">URL</th>
                <th style="width: 15%;">Priority</th>
                <th style="width: 15%;">Change Frequency</th>
                <th style="width: 15%;">Last Modified</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td>
                    <xsl:variable name="itemURL">
                      <xsl:value-of select="sitemap:loc"/>
                    </xsl:variable>
                    <a href="{$itemURL}">
                      <xsl:value-of select="sitemap:loc"/>
                    </a>
                  </td>
                  <td>
                    <span class="badge">
                      <xsl:value-of select="sitemap:priority"/>
                    </span>
                  </td>
                  <td>
                    <xsl:value-of select="sitemap:changefreq"/>
                  </td>
                  <td>
                    <xsl:value-of select="sitemap:lastmod"/>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
          <div class="footer">
            <span>TRIGGER10X &copy; 2026</span>
            <span>Total URLs: <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></span>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
