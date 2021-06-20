// import static from "@sveltejs/adapter-static"

// /** @type {import('@sveltejs/kit').Config} */

const config = {
  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    target: "#svelte",
    adapter: { adapt: () => "@sveltejs/adapter-netlify" },
  },
}

export default config
