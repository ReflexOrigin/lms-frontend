async function test() {
  const res = await fetch('http://localhost:1337/api/courses/fe9vgxbkbeel8mxezhbtrz5k', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: { title: 'Everything you need to know about Graph Engineering' } })
  });
  const json = await res.json();
  console.log(JSON.stringify(json, null, 2));
}
test();
