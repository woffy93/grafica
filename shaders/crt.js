crtShader = {
	uniforms: {

			"tDiffuse": { type: "t", value: null },
			"size":    { type: "v2", value: new THREE.Vector2( window.innerWidth, window.innerHeight) },
			"globalTime":{ type: "f", value: 0.0 }

		},

		vertexShader: [

			"varying vec2 vUv;",

			"void main() {",

				"vUv = uv;",
				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform vec2 size;",
			"uniform sampler2D tDiffuse;",
			"uniform float globalTime;",

			"varying vec2 vUv;",

			"vec3 scanline(vec2 coord, vec3 screen) {",
				"screen.xyz -= sin((coord.y*0.8 + (globalTime * 10.0))) * 0.03;",
				"return screen;",
			"}",

			"vec2 crt(vec2 coord, float bend) {",
				// put in symmetrical coords
				"coord = (coord - 0.5) * 1.85;",

				"coord *= 1.1;",

				// deform coords
				"coord.x *= 1.0 ;",
				"coord.y *= 1.0 ;",

				// transform back to 0.0 - 1.0 space
				"coord  = (coord / 2.0) + 0.5;",

				"return coord;",
			"}",

			"vec3 sampleSplit(sampler2D tex, vec2 coord) {",
				"vec3 frag;",
				"frag.r = texture2D(tex, vec2(coord.x - 0.005 * sin(globalTime), coord.y)).r;",
				"frag.g = texture2D(tex, vec2(coord.x                         , coord.y - 0.005 * cos(globalTime))).g;",
				"frag.b = texture2D(tex, vec2(coord.x + 0.005 * sin(globalTime), coord.y)).b;",
				"return frag;",
			"}",

			"void main() {",

				"vec2 uv = gl_FragCoord.xy / size.xy;",
				"vec2 crtCoords = crt(uv, 3.5);",

				// Split the color channels
				"gl_FragColor.xyz = sampleSplit(tDiffuse, crtCoords);",

				"vec2 screenSpace = crtCoords * size.xy;",
				"gl_FragColor.xyz = scanline(screenSpace, gl_FragColor.xyz);",




			"}"

		].join("\n")
				};
