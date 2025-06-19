const fs = require('fs');

let data;
try {
  data = JSON.parse(fs.readFileSync('export_fixed.json', 'utf-8'));
} catch (e) {
  console.error('Файл export_fixed.json невалиден!');
  process.exit(1);
}

let requiredFields = [
  "id", "name", "category", "brand", "price", "stock",
  "rating", "img", "description", "sold", "currency"
];

let errors = [];
data.forEach((item, idx) => {
  requiredFields.forEach(field => {
    if (!(field in item)) {
      errors.push(`Запись #${idx + 1}: отсутствует поле ${field}`);
    }
  });
  if (typeof item.price !== "number") {
    errors.push(`Запись #${idx + 1}: price не число (${item.price})`);
  }
  if (!Array.isArray(item.sold) || item.sold.length !== 12) {
    errors.push(`Запись #${idx + 1}: sold не массив из 12 чисел`);
  }
  if (!Array.isArray(item.currency) || item.currency.length !== 12) {
    errors.push(`Запись #${idx + 1}: currency не массив из 12 чисел`);
  }
});

if (errors.length) {
  console.error('Обнаружены ошибки в структуре export_fixed.json:\n' + errors.join('\n'));
  process.exit(1);
} else {
  console.log('export_fixed.json прошёл структурную валидацию.');
}
