const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomFloat = (min, max, decimals = 2) => {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);
  return parseFloat(str);
};

const randomDate = () => {
  const start = new Date(2023, 0, 1);
  const end = new Date();
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0]; // "YYYY-MM-DD"
};

const wilayas = ['Algiers', 'Oran', 'Constantine', 'Blida', 'Setif'];
const dairas = ['Daira A', 'Daira B', 'Daira C'];
const communes = ['Commune X', 'Commune Y', 'Commune Z'];

export const makeData = (count = 100) => {
  const data = [];

  for (let i = 1; i <= count; i++) {
    const apportStart = randomFloat(1000, 5000);
    const apportCurrent = randomFloat(0, apportStart); // ensure it's <= start

    data.push({
      customer_id: i,
      customer_firstname: `First${i}`,
      customer_lastname: `Last${i}`,
      customer_wilaya: wilayas[randomInt(0, wilayas.length - 1)],
      customer_daira: dairas[randomInt(0, dairas.length - 1)],
      customer_commune: communes[randomInt(0, communes.length - 1)],
      customer_apport_personnel_start: apportStart,
      customer_apport_personnel_current: apportCurrent,
      last_payment_date: randomDate(),
    });
  }

  return data;
};
