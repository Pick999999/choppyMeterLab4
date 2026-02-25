const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'js_analysis_v2.json');
const htmlPath = path.join(__dirname, 'js_analysis_summary.html');

try {
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const data = JSON.parse(rawData);

    let htmlContent = `
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JS Files Analysis Summary</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f9; color: #333; margin: 0; padding: 20px; }
        h1 { text-align: center; color: #2c3e50; margin-bottom: 30px; }
        .container { max-width: 1400px; margin: 0 auto; background: white; padding: 20px; box-shadow: 0 0 15px rgba(0,0,0,0.1); border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { padding: 12px 15px; border-bottom: 1px solid #ddd; vertical-align: top; }
        th { background-color: #34495e; color: white; text-align: left; font-weight: 600; }
        tr:hover { background-color: #f1f1f1; }
        .file-name { font-weight: bold; color: #e67e22; font-size: 1.1em; }
        .file-loc { font-size: 0.85em; color: #7f8c8d; display: block; margin-top: 4px; }
        .func-list { max-height: 200px; overflow-y: auto; display: flex; flex-wrap: wrap; gap: 5px; }
        .func-tag { background: #e0f2f1; color: #00695c; padding: 2px 8px; border-radius: 4px; font-size: 0.9em; border: 1px solid #b2dfdb; }
        .desc-text { line-height: 1.5; color: #444; }
        .meta-info { font-size: 0.95em; }
        .label { font-weight: bold; color: #555; display: block; margin-bottom: 3px; }
        
        /* Specific column widths */
        th.col-file { width: 15%; }
        th.col-desc { width: 30%; }
        th.col-func { width: 30%; }
        th.col-rels { width: 25%; }
    </style>
</head>
<body>
    <div class="container">
        <h1>JavaScript Files Analysis Summary</h1>
        <table>
            <thead>
                <tr>
                    <th class="col-file">File Name (Location)</th>
                    <th class="col-desc">Purpose (หน้าที่)</th>
                    <th class="col-func">Functions List</th>
                    <th class="col-rels">Relationships</th>
                </tr>
            </thead>
            <tbody>
`;

    data.forEach(item => {
        const functionsHtml = item.list_of_function_name.map(fn => `<span class="func-tag">${fn}</span>`).join('');

        htmlContent += `
                <tr>
                    <td>
                        <div class="file-name">${item.jsFileName}</div>
                        <span class="file-loc">${item.jsLocation}</span>
                    </td>
                    <td class="desc-text">${item['หน้าที่_ของ_function']}</td>
                    <td>
                        <div class="func-list">
                            ${functionsHtml}
                        </div>
                    </td>
                    <td class="meta-info">
                        <div style="margin-bottom: 12px;">
                            <span class="label">Called By (Parent):</span>
                            ${item['ใครเป็น_Parent_ที่เรียกใช้']}
                        </div>
                        <div>
                            <span class="label">Calls External:</span>
                            ${item['มันเรียก_function_อะไรมาทำงานบ้าง']}
                        </div>
                    </td>
                </tr>
        `;
    });

    htmlContent += `
            </tbody>
        </table>
    </div>
</body>
</html>
`;

    fs.writeFileSync(htmlPath, htmlContent);
    console.log('Successfully created ' + htmlPath);

} catch (error) {
    console.error('Error generating HTML:', error);
}
