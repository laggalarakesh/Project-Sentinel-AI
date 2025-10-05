/**
 * Formats a single cell for CSV, handling commas, quotes, and newlines.
 * @param cellData The data for the cell.
 * @returns A CSV-formatted string for the cell.
 */
const formatCSVCell = (cellData: any): string => {
    const cellString = String(cellData ?? '');
    // If the string contains a comma, double quote, or newline, wrap it in double quotes.
    if (/[",\n]/.test(cellString)) {
        // Within a quoted string, any double quotes must be escaped by another double quote.
        return `"${cellString.replace(/"/g, '""')}"`;
    }
    return cellString;
};

/**
 * Converts an array of objects to a CSV string and triggers a download.
 * @param data The array of objects to export.
 * @param filename The name of the file to be downloaded.
 */
export const exportToCSV = <T extends object>(data: T[], filename: string): void => {
    if (!data || data.length === 0) {
        console.error("No data available to export.");
        alert("No data to export.");
        return;
    }

    // Flatten nested objects for headers and rows (one level deep)
    const flattenedData = data.map(row => {
        const flatRow: { [key: string]: any } = {};
        Object.entries(row).forEach(([key, value]) => {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                Object.entries(value).forEach(([subKey, subValue]) => {
                    // Create a composite key like "ownerName"
                    const compositeKey = `${key}${subKey.charAt(0).toUpperCase() + subKey.slice(1)}`;
                    flatRow[compositeKey] = subValue;
                });
            } else {
                flatRow[key] = value;
            }
        });
        return flatRow;
    });

    const headers = Object.keys(flattenedData[0]);
    const headerRow = headers.map(formatCSVCell).join(',');

    const csvRows = flattenedData.map(row => 
        headers.map(header => formatCSVCell(row[header])).join(',')
    );

    const csvString = [headerRow, ...csvRows].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    // FIX: Cast navigator to 'any' to access the IE-specific 'msSaveBlob' property without TypeScript errors.
    if ((navigator as any).msSaveBlob) { // IE 10+
        (navigator as any).msSaveBlob(blob, filename);
    } else {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
};
