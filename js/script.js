"use strict";
console.clear();
import * as THREE from "three";
import { OrbitControls as e } from "three/addons/controls/OrbitControls.js";
import { ImprovedNoise as t } from "three/addons/math/ImprovedNoise.js";
import { OBJExporter as n } from "three/addons/exporters/OBJExporter.js";
import { GLTFExporter as o } from "three/addons/exporters/GLTFExporter.js";
import { GUI as i } from "three/addons/libs/lil-gui.module.min.js";
!(function () {
	let r = document.createElement("canvas"),
		a = r.getContext("2d");
	var l = a.createLinearGradient(0, r.height, 0, 0);
	l.addColorStop(0, "navy"),
		l.addColorStop(0.35, "navy"),
		l.addColorStop(0.45, "midnightblue"),
		l.addColorStop(0.48, "midnightblue"),
		l.addColorStop(0.5, "royalblue"),
		l.addColorStop(0.5, "yellowgreen"),
		l.addColorStop(0.75, "peru"),
		l.addColorStop(1, "saddlebrown"),
		(a.fillStyle = l),
		a.fillRect(0, 0, r.width, r.height);
	let d,
		s,
		c,
		u,
		p,
		m,
		f,
		h,
		w,
		g,
		E,
		x,
		v,
		y,
		b = new THREE.CanvasTexture(r);
	function T() {
		(h = 500), (w = 70), (g = 80), (E = 4.5), (x = 3), (v = "Circle");
	}
	function C() {
		s.remove(f), f.material.dispose(), f.geometry.dispose(), R();
	}
	function R() {
		const e = (function (e, n) {
			let o = 0;
			const i = e * n;
			let r = new Float32Array(i);
			r = Array.from(r);
			let a = 0,
				l = new THREE.Vector3(e / 2, n / 2, 0);
			for (let t = 0; t < n; t++)
				for (let n = 0; n < e; n++) {
					let i = t,
						d = n,
						s = new THREE.Vector3(i, d, 0),
						c = s.distanceTo(l),
						u = (c / e) * Math.PI * 3;
					o = (u -= 1.5) < 0 ? g : w;
					const p = Math.sin(u) * o;
					(r[a] = p), a++;
				}
			let d = new t(),
				s = 100 * Math.random(),
				c = 1;
			for (let t = 0; t < E; t++) {
				for (let t = 0; t < i; t++) {
					let n = t % e,
						o = ~~(t / e);
					r[t] += Math.abs(d.noise(n / c, o / c, s) * c);
				}
				c *= x;
			}
			if ("Circle" == v || "Circular style" == v) {
				let t = Math.floor(Math.min(e / 2, n / 2));
				for (let o = 0; o < i; o++) {
					let i = o % e,
						a = ~~(o / e),
						d = new THREE.Vector3(i, a, 0),
						s = Math.abs(d.distanceTo(l));
					if (((r[o] *= Math.cos((s / t) * (Math.PI / 2))), "Circle" == v && s >= t)) {
						let i = (s - t) / Math.sqrt(e * e + n * n);
						r[o] -= i * (g + w) * 3;
					} else;
				}
			}
			return r;
		})(h, h);
		(p = new THREE.PlaneGeometry(h, h, h - 1, h - 1)).rotateX(-Math.PI / 2);
		const n = p.attributes.position.array;
		let o = 0;
		for (let t = 0, i = 0, r = n.length; t < r; t++, i += 3) (n[i + 1] = e[t]), o < e[t] && (o = e[t]);
		p.computeVertexNormals();
		let i = { colorTexture: { value: b }, limits: { value: o } };
		(m = new THREE.MeshLambertMaterial({
			side: THREE.DoubleSide,
			onBeforeCompile: (e) => {
				(e.uniforms.colorTexture = i.colorTexture),
					(e.uniforms.limits = i.limits),
					(e.vertexShader = `\n      varying vec3 vPos;\n      ${e.vertexShader}\n    `.replace(
						"#include <fog_vertex>",
						"#include <fog_vertex>\n      vPos = vec3(position);\n      "
					)),
					(e.fragmentShader =
						`\n      uniform float limits;\n      uniform sampler2D colorTexture;\n      \n      varying vec3 vPos;\n      ${e.fragmentShader}\n    `.replace(
							"vec4 diffuseColor = vec4( diffuse, opacity );",
							"\n        float h = (vPos.y - (-limits))/(limits * 2.);\n        h = clamp(h, 0., 1.);\n        vec4 diffuseColor = texture2D(colorTexture, vec2(0, h));\n      "
						));
			},
		})),
			(f = new THREE.Mesh(p, m)),
			s.add(f);
	}
	T(),
		(function () {
			(y = {
				size: h,
				elevation: w,
				depth: g,
				complexity: E,
				quality_ratio: x,
				island_shape: v,
				regenerate: function () {
					C(), P();
				},
				reset: function () {
					o.children[0].controllers.forEach((e) => e.setValue(e.initialValue)), T(), C(), P();
				},
				exportToObj: H,
				exportGLTF: M,
			}),
				((s = new THREE.Scene()).background = 0),
				(c = new THREE.WebGLRenderer({ antialias: !0 })).setPixelRatio(window.devicePixelRatio),
				c.setSize(window.innerWidth, window.innerHeight),
				document.body.appendChild(c.domElement),
				(d = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 3 * h)).position.set(
					0,
					0.8 * h,
					1 * h
				),
				d.lookAt(0, 0, 0);
			const t = new THREE.AmbientLight("white", 1);
			s.add(t);
			const n = new THREE.DirectionalLight("white", 1);
			n.position.set(0, 3, 8), s.add(n);
			const o = new i();
			let r = o.addFolder("Settings");
			r
				.add(y, "elevation", 0, 150)
				.name("Land elevation")
				.step(1)
				.onChange(function (e) {
					(w = e), C(), P();
				}),
				r
					.add(y, "depth", 0, 200)
					.name("Lake depth")
					.step(1)
					.onChange(function (e) {
						(g = e), C(), P();
					}),
				r
					.add(y, "complexity", 3, 5)
					.name("Noise-complexity")
					.step(0.1)
					.onChange(function (e) {
						(E = e), C(), P();
					}),
				r
					.add(y, "quality_ratio", 2, 8)
					.name("Noise-quality")
					.step(0.1)
					.onChange(function (e) {
						(x = e), C(), P();
					}),
				r
					.add(y, "island_shape")
					.options(["Square", "Circle", "Circular style"])
					.name("island shape")
					.onChange(function (e) {
						(v = e), C(), P();
					}),
				r.add(y, "reset").name("Reset"),
				r.add(y, "regenerate").name("Regenerate"),
				(r = o.addFolder("Export")).add(y, "exportToObj").name("Export OBJ"),
				r.add(y, "exportGLTF").name("Export GLTF"),
				o.open(),
				R(),
				((u = new e(d, c.domElement)).autoRotate = !0),
				(u.autoRotateSpeed = 2),
				(u.enableDamping = !0),
				(u.enablePan = !1),
				(u.minDistance = 0.1),
				(u.maxDistance = 2 * h),
				u.target.set(0, 0, 0),
				u.update(),
				window.addEventListener("resize", j);
		})(),
		(function e() {
			requestAnimationFrame(e);
			u.update();
			P();
		})();
	const S = document.createElement("a");
	function H() {
		L(new n().parse(f), "object.obj");
	}
	function M() {
		new o().parse(
			f,
			function (e) {
				if (e instanceof ArrayBuffer) saveArrayBuffer(e, "object.glb");
				else {
					L(JSON.stringify(e, null, 2), "object.gltf");
				}
			},
			function (e) {
				console.log("An error happened during parsing", e);
			},
			{ trs: !1, onlyVisible: !0, binary: !1, maxTextureSize: 4096 }
		);
	}
	function L(e, t) {
		!(function (e, t) {
			(S.href = URL.createObjectURL(e)), (S.download = t), S.click();
		})(new Blob([e], { type: "text/plain" }), t);
	}
	function j() {
		(d.aspect = window.innerWidth / window.innerHeight),
			d.updateProjectionMatrix(),
			c.setSize(window.innerWidth, window.innerHeight);
	}
	function P() {
		c.render(s, d);
	}
	(S.style.display = "none"), document.body.appendChild(S);
})();
