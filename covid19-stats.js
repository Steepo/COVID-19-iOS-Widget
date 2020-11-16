// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: magic;

let widget = await createWidget();
await widget.presentSmall();

Script.setWidget(widget);
Script.complete();

async function createWidget() {
	var months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
	const list = new ListWidget();
	padding = 5
	list.setPadding(padding, padding, padding, padding)
	const url = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json"
    const data = await new Request(url).loadJSON();

	console.log(data.length)
	const last = data.length - 1
	list.backgroundColor = new Color('#272729', 1);
	
	
	var date = new Date(data[last].data);
	var date = date.getDate() + " " + months[date.getMonth()-1]
	createLabel(list, '🦠 COVID-19  ' + date, 12)
	
	list.addSpacer(5)

	createLabel(list, 'incremento casi', 10)
	nuoviPositivi = data[last].nuovi_positivi
	nuoviPositivi = nuoviPositivi > 0  ? "+" + nuoviPositivi : nuoviPositivi
	insertNumbers(list, numberWithCommas(nuoviPositivi), Color.orange())
	
	
	createLabel(list, 'guariti', 10)
	deltaGuariti = data[last].dimessi_guariti - data[last-1].dimessi_guariti
	deltaGuariti = deltaGuariti > 0  ? "+" + deltaGuariti : deltaGuariti
	insertNumbers(list, numberWithCommas(deltaGuariti), Color.green())

	createLabel(list, 'deceduti', 10)
	deltaDeceduti = data[last].deceduti - data[last-1].deceduti
	deltaDeceduti = deltaDeceduti > 0  ? "+" + deltaDeceduti : deltaDeceduti
	insertNumbers(list, numberWithCommas(deltaDeceduti), Color.red())

	createLabel(list, 'incremento tamponi', 10)
	deltatamponi = data[last].tamponi - data[last-1].tamponi
	deltatamponi = deltatamponi > 0  ? "+" + deltatamponi : deltatamponi
	insertNumbers(list, numberWithCommas(deltatamponi), Color.gray())

	return list;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function createLabel(stack, text, fontSize){
	let label = stack.addText(text.toUpperCase());
	label.font = Font.boldSystemFont(fontSize);
	label.lineLimit = 1
	label.textColor = Color.white();
	label.centerAlignText();
	return label
}
function insertNumbers(stack, text, color){
	let label = stack.addText(text);
	label.font = Font.semiboldSystemFont(17);
	label.lineLimit = 1
	label.textColor = color
	label.centerAlignText();
	return label
}