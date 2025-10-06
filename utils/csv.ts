
import { AppState, Tool, toolDetails } from '../types';
import { calculateKPIs } from './calculations';

// To inform TypeScript that ExcelJS is a global variable from the script tag in index.html
declare var ExcelJS: any;

// Helper function to save the workbook
const saveWorkbook = (buffer: ArrayBuffer, fileName: string): void => {
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const exportStyledReport = async (state: AppState): Promise<void> => {
    // Check if ExcelJS library is loaded
    if (typeof ExcelJS === 'undefined') {
        alert('Excel export library could not be loaded. Please ensure you have an internet connection and try again.');
        return;
    }
    
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Outreach Roadmap';
    workbook.created = new Date();

    // --- Define reusable styles in ExcelJS format ---
    // Note: ARGB format is FF + RRGGBB
    const styles = {
        title: { 
            font: { size: 16, bold: true, color: { argb: "FFFFFFFF" } }, 
            fill: { type: 'pattern', pattern:'solid', fgColor:{ argb: "FF2563EB" } },
            alignment: { horizontal: "center", vertical: "middle" } 
        },
        sectionHeader: { 
            font: { size: 12, bold: true, color: { argb: "FFFFFFFF" } }, 
            fill: { type: 'pattern', pattern:'solid', fgColor:{ argb: "FF374151" } },
            alignment: { horizontal: "left", vertical: "middle" } 
        },
        tableHeader: { 
            font: { bold: true, color: { argb: "FFE5E7EB" } }, 
            fill: { type: 'pattern', pattern:'solid', fgColor:{ argb: "FF4B5563" } },
            alignment: { horizontal: "center", vertical: "middle" } 
        },
        baseCell: {
            fill: { type: 'pattern', pattern:'solid', fgColor:{ argb: "FF1F2937" } },
            font: { color: { argb: "FFE5E7EB" } },
            alignment: { vertical: "middle" }
        },
        dataRowFill: { // Stripe color
            fill: { type: 'pattern', pattern:'solid', fgColor:{ argb: "FF2D3748" } },
            font: { color: { argb: "FFE5E7EB" } },
            alignment: { vertical: "middle" }
        },
        keyCell: { 
            font: { bold: true, color: { argb: "FFD1D5DB" } } 
        },
        finalActionLabel: { 
            font: { size: 12, bold: true, color: { argb: "FF60A5FA" } }, 
            alignment: { horizontal: "center", vertical: "middle" },
            fill: { type: 'pattern', pattern:'solid', fgColor:{ argb: "FF1F2937" } },
        },
        finalActionValue: { 
            font: { size: 24, bold: true, color: { argb: "FFFFFFFF" } }, 
            alignment: { horizontal: "center", vertical: "middle" },
            fill: { type: 'pattern', pattern:'solid', fgColor:{ argb: "FF1F2937" } },
        },
        positiveGap: { 
            font: { color: { argb: "FF10B981" }, bold: true }, 
            alignment: { vertical: "middle", horizontal: "right" } 
        },
        negativeGap: { 
            font: { color: { argb: "FFEF4444" }, bold: true }, 
            alignment: { vertical: "middle", horizontal: "right" } 
        },
        neutralGap: { 
            font: { color: { argb: "FF6B7280" } }, 
            alignment: { vertical: "middle", horizontal: "right" } 
        }
    };

    // --- Define reusable number formats ---
    const formats = {
        currency: '$#,##0',
        number: '#,##0',
        percentage: '0.00%'
    };

    const { programSettings } = state;

    for (const tool of [Tool.LIO, Tool.FIO, Tool.EO]) {
        const sheetName = toolDetails[tool].name.replace(/ & | /g, '_').substring(0, 31);
        const ws = workbook.addWorksheet(sheetName);
        let currentRow = 1;
        const cellRefs: { [key: string]: string } = {};

        // --- Title ---
        ws.addRow([toolDetails[tool].name]);
        ws.mergeCells(currentRow, 1, currentRow, 4);
        ws.getRow(currentRow).height = 30;
        ws.getRow(currentRow).getCell(1).style = styles.title;
        currentRow++;
        ws.addRow([]); // Spacer
        currentRow++;

        // --- Global Settings ---
        ws.addRow(['Global Settings']);
        ws.mergeCells(currentRow, 1, currentRow, 4);
        ws.getRow(currentRow).getCell(1).style = styles.sectionHeader;
        currentRow++;
        
        const settingsRows = [
            { label: 'Offer Name', value: programSettings.offerName, format: null, ref: 'offerName' },
            { label: 'Offer Price', value: programSettings.offerPrice, format: formats.currency, ref: 'offerPrice' },
            { label: 'Target Revenue Goal', value: programSettings.targetRevenueGoal, format: formats.currency, ref: 'targetRevenue' }
        ];

        settingsRows.forEach((rowData, index) => {
            const row = ws.addRow([rowData.label, rowData.value]);
            const baseStyle = (index % 2 !== 0) ? styles.dataRowFill : styles.baseCell;
            row.getCell(1).style = { ...baseStyle, ...styles.keyCell };
            row.getCell(2).style = { ...baseStyle, numFmt: rowData.format || undefined };
            cellRefs[rowData.ref] = `B${currentRow}`;
            currentRow++;
        });
        ws.addRow([]); // Spacer
        currentRow++;


        // --- Current Performance Data ---
        ws.addRow(['Current Performance Data']);
        ws.mergeCells(currentRow, 1, currentRow, 4);
        ws.getRow(currentRow).getCell(1).style = styles.sectionHeader;
        currentRow++;
        
        const perfData = state[tool].currentPerformance;
        const perfRows: {label: string, value: number, ref: string}[] = [];
        if (tool === Tool.LIO) {
            perfRows.push({ label: 'Connection Requests Sent', value: perfData.connectionRequestsSent, ref: 'requestsSent' });
            perfRows.push({ label: 'Total Accepted Requests', value: perfData.totalAcceptedRequests, ref: 'acceptedRequests' });
        } else {
            perfRows.push({ label: tool === Tool.EO ? 'Emails Sent' : 'Messages Sent', value: perfData.messagesSent, ref: 'messagesSent' });
            perfRows.push({ label: 'Total Replies', value: perfData.totalReplies, ref: 'totalReplies' });
        }
        perfRows.push({ label: 'Positive Replies', value: perfData.positiveReplies, ref: 'positiveReplies' });
        perfRows.push({ label: 'Meetings Scheduled', value: perfData.meetingsScheduled, ref: 'meetingsScheduled' });
        perfRows.push({ label: 'Total Shows', value: perfData.totalShows, ref: 'totalShows' });
        perfRows.push({ label: 'Deals Closed', value: perfData.dealsClosed, ref: 'dealsClosed' });
        perfRows.push({ label: 'Sales Cycle Length (Days)', value: perfData.salesCycleLength, ref: 'salesCycleLength' });

        perfRows.forEach((rowData, index) => {
            const row = ws.addRow([rowData.label, rowData.value]);
            const baseStyle = (index % 2 !== 0) ? styles.dataRowFill : styles.baseCell;
            row.getCell(1).style = { ...baseStyle, ...styles.keyCell };
            row.getCell(2).style = { ...baseStyle, numFmt: formats.number };
            cellRefs[rowData.ref] = `B${currentRow}`;
            currentRow++;
        });
        ws.addRow([]); // Spacer
        currentRow++;

        // --- Reference KPI Targets ---
        ws.addRow(['Reference KPI Targets']);
        ws.mergeCells(currentRow, 1, currentRow, 4);
        ws.getRow(currentRow).getCell(1).style = styles.sectionHeader;
        currentRow++;

        const targetsData = state[tool].referenceTargets;
        const targetRows: {label: string, value: number, ref: string, isPercent?: boolean, isCurrency?: boolean}[] = [];
        if (tool === Tool.LIO) {
            targetRows.push({ label: 'Target Request Acceptance Rate (%)', value: targetsData.requestAcceptanceRate, ref: 'targetAcceptanceRate', isPercent: true });
        }
        targetRows.push({ label: 'Target Positive Reply Rate (%)', value: targetsData.positiveReplyRate, ref: 'targetPositiveReplyRate', isPercent: true });
        targetRows.push({ label: 'Target Meeting Booking Rate (%)', value: targetsData.meetingBookingRate, ref: 'targetMeetingBookingRate', isPercent: true });
        targetRows.push({ label: 'Target Show Up Rate (%)', value: targetsData.showUpRate, ref: 'targetShowUpRate', isPercent: true });
        targetRows.push({ label: 'Target Close Rate (%)', value: targetsData.closeRate, ref: 'targetCloseRate', isPercent: true });
        targetRows.push({ label: 'Target Average Deal Value ($)', value: targetsData.avgDealValue, ref: 'targetAvgDealValue', isCurrency: true });
        targetRows.push({ label: 'Target Sales Cycle Length (Days)', value: targetsData.salesCycleLength, ref: 'targetSalesCycle' });

        targetRows.forEach((rowData, index) => {
            const row = ws.addRow([rowData.label, rowData.value]);
            const baseStyle = (index % 2 !== 0) ? styles.dataRowFill : styles.baseCell;
            row.getCell(1).style = { ...baseStyle, ...styles.keyCell };
            const valueCell = row.getCell(2);
            let numFmt = formats.number;
            if(rowData.isCurrency) numFmt = formats.currency;
            valueCell.style = { ...baseStyle, numFmt };

            if (rowData.isPercent) {
                valueCell.note = 'Enter as a whole number (e.g., 35 for 35%)';
            }
            cellRefs[rowData.ref] = `B${currentRow}`;
            currentRow++;
        });
        ws.addRow([]); // Spacer
        currentRow++;
        
        // --- KPI Gap Analysis ---
        ws.addRow(['KPI Gap Analysis']);
        ws.mergeCells(currentRow, 1, currentRow, 4);
        ws.getRow(currentRow).getCell(1).style = styles.sectionHeader;
        currentRow++;
        
        const kpiHeaderRow = ws.addRow(['Metric', 'Current', 'Target', 'Gap']);
        kpiHeaderRow.eachCell(cell => cell.style = styles.tableHeader);
        currentRow++;

        const kpiRowsData: any[] = [];
        if (tool === Tool.LIO) kpiRowsData.push({
            label: 'Request Acceptance Rate', 
            current: { formula: `IF(${cellRefs.requestsSent}>0, ${cellRefs.acceptedRequests}/${cellRefs.requestsSent}, 0)` }, 
            target: { formula: `${cellRefs.targetAcceptanceRate}/100` }, 
            isPercent: true});
        
        let positiveReplyRateFormula: string;
        if (tool === Tool.LIO) {
            positiveReplyRateFormula = `IF(${cellRefs.acceptedRequests}>0, ${cellRefs.positiveReplies}/${cellRefs.acceptedRequests}, 0)`;
        } else { // FIO & EO
            positiveReplyRateFormula = `IF(${cellRefs.messagesSent}>0, ${cellRefs.positiveReplies}/${cellRefs.messagesSent}, 0)`;
        }

        kpiRowsData.push({label: 'Positive Reply Rate', current: { formula: positiveReplyRateFormula }, target: { formula: `${cellRefs.targetPositiveReplyRate}/100` }, isPercent: true});
        kpiRowsData.push({label: 'Meeting Booking Rate', current: { formula: `IF(${cellRefs.positiveReplies}>0, ${cellRefs.meetingsScheduled}/${cellRefs.positiveReplies}, 0)` }, target: { formula: `${cellRefs.targetMeetingBookingRate}/100` }, isPercent: true});
        kpiRowsData.push({label: 'Show Up Rate', current: { formula: `IF(${cellRefs.meetingsScheduled}>0, ${cellRefs.totalShows}/${cellRefs.meetingsScheduled}, 0)` }, target: { formula: `${cellRefs.targetShowUpRate}/100` }, isPercent: true});
        kpiRowsData.push({label: 'Close Rate', current: { formula: `IF(${cellRefs.totalShows}>0, ${cellRefs.dealsClosed}/${cellRefs.totalShows}, 0)` }, target: { formula: `${cellRefs.targetCloseRate}/100` }, isPercent: true});
        kpiRowsData.push({label: 'Average Deal Value', current: { formula: `IF(${cellRefs.dealsClosed}>0, (${cellRefs.dealsClosed}*${cellRefs.offerPrice})/${cellRefs.dealsClosed}, ${cellRefs.offerPrice})` }, target: { formula: `${cellRefs.targetAvgDealValue}` }, isCurrency: true});
        kpiRowsData.push({label: 'Sales Cycle Length (Days)', current: { formula: `${cellRefs.salesCycleLength}` }, target: { formula: `${cellRefs.targetSalesCycle}` }});
        
        kpiRowsData.forEach((data, index) => {
            const currentCellRef = `B${currentRow}`;
            const targetCellRef = `C${currentRow}`;
            const gapFormula = `${currentCellRef}-${targetCellRef}`;
            
            const row = ws.addRow([data.label, data.current, data.target, { formula: gapFormula }]);
            const baseRowStyle = (index % 2 !== 0) ? styles.dataRowFill : styles.baseCell;

            let format = formats.number;
            if (data.isPercent) format = formats.percentage;
            else if (data.isCurrency) format = formats.currency;

            row.getCell(1).style = { ...baseRowStyle, ...styles.keyCell };
            row.getCell(2).style = { ...baseRowStyle, numFmt: format };
            row.getCell(3).style = { ...baseRowStyle, numFmt: format };
            
            const gapCell = row.getCell(4);
            const shorterIsBetter = data.label.includes('Cycle');
            
            const gapStyle = shorterIsBetter ? styles.positiveGap : styles.negativeGap;
            const inverseGapStyle = shorterIsBetter ? styles.negativeGap : styles.positiveGap;
            
            gapCell.style = { ...baseRowStyle, numFmt: format };
            ws.addConditionalFormatting({
                ref: gapCell.address,
                rules: [
                    { type: 'expression', formulae: [`${gapCell.address}<0`], style: gapStyle },
                    { type: 'expression', formulae: [`${gapCell.address}>0`], style: inverseGapStyle },
                    { type: 'expression', formulae: [`${gapCell.address}=0`], style: styles.neutralGap },
                ]
            });
            currentRow++;
        });
        ws.addRow([]); // spacer
        currentRow++;
        
        // --- Final Action Plan ---
        ws.addRow(['Final Action Plan']);
        ws.mergeCells(currentRow, 1, currentRow, 4);
        ws.getRow(currentRow).getCell(1).style = styles.sectionHeader;
        currentRow++;

        // Define plan items with formula-generating functions to ensure correct cell references
        const planItems = [
            { label: 'Deals to Close', ref: 'dealsNeeded', formula: (refs: any) => `ROUNDUP(IF(${refs.offerPrice}>0, ${refs.targetRevenue}/${refs.offerPrice}, 0), 0)` },
            { label: 'Meetings to Attend (Shows)', ref: 'showsNeeded', formula: (refs: any) => `ROUNDUP(IF((${refs.targetCloseRate}/100)>0, ${refs.dealsNeeded}/(${refs.targetCloseRate}/100), 0), 0)` },
            { label: 'Meetings to Schedule', ref: 'meetingsNeeded', formula: (refs: any) => `ROUNDUP(IF((${refs.targetShowUpRate}/100)>0, ${refs.showsNeeded}/(${refs.targetShowUpRate}/100), 0), 0)` },
            { label: 'Positive Replies to Generate', ref: 'positiveRepliesNeeded', formula: (refs: any) => `ROUNDUP(IF((${refs.targetMeetingBookingRate}/100)>0, ${refs.meetingsNeeded}/(${refs.targetMeetingBookingRate}/100), 0), 0)` }
        ];

        if (tool === Tool.LIO) {
            planItems.push({ label: 'Connections to Accept', ref: 'connectionsNeeded', formula: (refs: any) => `ROUNDUP(IF((${refs.targetPositiveReplyRate}/100)>0, ${refs.positiveRepliesNeeded}/(${refs.targetPositiveReplyRate}/100), 0), 0)` });
        }

        // Build the action plan rows iteratively, creating correct formula dependencies
        planItems.forEach((item, index) => {
            const formula = item.formula(cellRefs);
            const row = ws.addRow([item.label, { formula }]);
            const baseStyle = (index % 2 !== 0) ? styles.dataRowFill : styles.baseCell;
            row.getCell(1).style = { ...baseStyle, ...styles.keyCell };
            row.getCell(2).style = { ...baseStyle, numFmt: formats.number };
            cellRefs[item.ref] = `B${currentRow}`; // Store ref for the next iteration's formula
            currentRow++;
        });

        // Determine the final action formula based on the last calculated step
        let finalActionFormula: string;
        if (tool === Tool.LIO) {
            finalActionFormula = `ROUNDUP(IF((${cellRefs.targetAcceptanceRate}/100)>0, ${cellRefs.connectionsNeeded}/(${cellRefs.targetAcceptanceRate}/100), 0), 0)`;
        } else {
            finalActionFormula = `ROUNDUP(IF((${cellRefs.targetPositiveReplyRate}/100)>0, ${cellRefs.positiveRepliesNeeded}/(${cellRefs.targetPositiveReplyRate}/100), 0), 0)`;
        }
        
        ws.addRow([]); // Spacer
        currentRow++;
        
        // --- Final Action ---
        const finalActionLabel = tool === Tool.LIO ? 'Connection Requests to Send' : (tool === Tool.EO ? 'Emails to Send' : 'Messages to Send');
        ws.addRow([finalActionLabel]);
        ws.mergeCells(currentRow, 1, currentRow, 4);
        ws.getRow(currentRow).getCell(1).style = styles.finalActionLabel;
        currentRow++;
        
        ws.addRow([{ formula: finalActionFormula }]);
        ws.mergeCells(currentRow, 1, currentRow, 4);
        ws.getRow(currentRow).height = 40;
        const finalValueCell = ws.getRow(currentRow).getCell(1);
        finalValueCell.style = { ...styles.finalActionValue, numFmt: formats.number };
        
        // Set column widths
        ws.columns = [ { width: 35 }, { width: 20 }, { width: 20 }, { width: 20 } ];
    }
    
    const buffer = await workbook.xlsx.writeBuffer();
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const fileName = `OutreachRoadmap_FullPlan_${timestamp}.xlsx`;
    saveWorkbook(buffer, fileName);
}
