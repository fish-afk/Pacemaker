async function poster() {
	const res = await fetch("/admin/login", {
		method: "POST",
		body: JSON.stringify({ username: "slide", password: "slide" }),
	});
	const json_ = await res.json();
	console.log(json_);
}
poster();
