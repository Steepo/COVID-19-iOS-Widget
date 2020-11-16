// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
// Credits to KittMedia for the graph code
//

const lineWidth = 3;
const vertLineWidth = .5;
const accentColor1 = Color.orange();
const accentColor2 = Color.lightGray();

const widgetHeight = 338;
const widgetWidth = 720;
const graphLow = 290;
const graphHeight = 210;
const spaceBetweenDays = 33;

let drawContext = new DrawContext();
drawContext.size = new Size(widgetWidth, widgetHeight);
drawContext.opaque = false;

let widget = await createWidget();
widget.setPadding(0, 0, 0, 0);
widget.backgroundImage = drawContext.getImage();
await widget.presentMedium();

Script.setWidget(widget);
Script.complete();

async function createWidget(items){
	const list = new ListWidget();
	

	const covidita = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json"
    const cityData = await new Request(covidita).loadJSON();
	list.backgroundColor = new Color('#272729', 1);
	

	list.addSpacer(5)
	let label = list.addText('🦠 COVID-19'.toUpperCase() + ' Italy');
	label.font = Font.boldSystemFont(15);
	label.lineLimit = 1
	label.textColor = Color.white();
	label.centerAlignText();
	list.addSpacer(null)

	let min, max, diff;
	const days = 20
	for (let i = cityData.length - days; i < cityData.length; i++){
		let temp = cityData[i].nuovi_positivi;
		min = (temp < min || min == undefined ? temp : min);
		max = (temp > max || max == undefined ? temp : max);
	}
	
	diff = max - min;
	
	const highestIndex = cityData.length - 1;
	let index = -1
	const offset = 45
	for (let i = cityData.length - days; i < cityData.length; i++){
        index ++
        const day = (new Date(cityData[i].data)).getDate();
        const cases = cityData[i].nuovi_positivi;
        const delta = (cases - min) / diff;
		
		if (i < highestIndex){
			const nextCases = cityData[ i + 1 ].nuovi_positivi;
			const nextDelta = (nextCases - min) / diff;
			const point1 = new Point(spaceBetweenDays * index + offset, graphLow - (graphHeight * delta));
            const point2 = new Point(spaceBetweenDays * (index + 1) + offset, graphLow - (graphHeight * nextDelta));
			drawLine(point1, point2, lineWidth, accentColor1);
		}
		
		// vertical lines
		const point1 = new Point(spaceBetweenDays * index + offset, graphLow - (graphHeight * delta));
        const point2 = new Point(spaceBetweenDays * index + offset, graphLow);
		drawLine(point1, point2, vertLineWidth, accentColor2);
		
		let dayColor = Color.white();

		// cases 
		const casesRect = new Rect(spaceBetweenDays * index + 35, (graphLow - 40) - (graphHeight * delta), 60, 23);
		drawTextR(kFormatter(cases), casesRect, dayColor, Font.systemFont(19));
		
		// days
		const dayRect = new Rect(spaceBetweenDays * index + 35, graphLow + 10, 50, 23);
		drawTextR(day, dayRect, dayColor, Font.systemFont(19));
	}
	
	return list;
}
function kFormatter(num){
    return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
}

function drawTextR(text, rect, color, font){
	drawContext.setFont(font);
	drawContext.setTextColor(color);
	drawContext.drawTextInRect(new String(text).toString(), rect);
}

function drawLine(point1, point2, width, color){
	const path = new Path();
	path.move(point1);
	path.addLine(point2);
	drawContext.addPath(path);
	drawContext.setStrokeColor(color);
	drawContext.setLineWidth(width);
	drawContext.strokePath();
}