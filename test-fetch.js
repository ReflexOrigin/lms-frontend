async function test() {
  const res = await fetch('http://localhost:1337/api/courses');
  const json = await res.json();
  console.log(JSON.stringify(json, null, 2));
}
test();
