// Import FS
/*
const fs = require('fs');
// Import Node Printer (node-printer)
try { const printer = require('printer'); } catch(e) {
  console.log('[Printer-NPH] Printer Error: ',e);
  throw '[Printer-NPH] Printer Error: ' + e;
}
// Import ImageMagic (imagemagick-native)
imagemagick = null;

*/

/*try { const imagemagick = require('imagemagick-native'); } catch(e) {
  throw '[Printer-NPH] please install imagemagick-native: npm install imagemagick-native'
}*/

/** IMNodePrinter */
//# ImageMagick Node Printer Helper
/*
export default class IMNodePrinter {

  // Obtener nombre de impresora por defecto
  defaultPrinter() {
    return printer.getDefaultPrinterName();
  }

  // PDF Printer (Convierte a EMF y luego imprime)
  PDFPrint(filename = null, options = {}) {

    if(!filename) { throw '[Printer-NPH] PDF file name is missing. Please use the following params: <filename> [printername]' };

    // Leemos el archivo PDF
    var data = fs.readFileSync(filename);
    console.log('[Printer-NPH] data: ' + data.toString().substr(0, 20));//console.log(imagemagick.identify({srcData: data}));

    // Convertimos el PDF a EMF
    imagemagick.convert({
        srcData: data,
        srcFormat: 'PDF',
        format: 'EMF',
    }, (err, buffer) => {
        // Cuando acabe detectamos si hubo algun error
        if (err) {
            console.log('[Printer-NPH] Error: '+err);
            throw '[Printer-NPH] something went wrong on converting to EMF: ' + err;
            return false;
        }
        // Imprimir en base al Buffer
        return this.printByBuffer(buffer, options);
    });

  }

  // Print by buffer (EMF)
  printByBuffer(buffer, options = {}) {

    // Obtenemos el nombre de la impresora por defecto
    const printername = this.defaultPrinter();

    // Now we have EMF file, send it to printer as EMF format
    printer.printDirect({
        data: buffer,
        type: 'EMF',
        success: function(id) {
            console.log('[Printer-NPH] printed with id ' + id);
            return true;
        },
        error: function(err) {
            console.error('[Printer-NPH] error on printing: ' + err);
            return false;
        },
        options
    });

  }

}*/
