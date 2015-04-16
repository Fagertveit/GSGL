precision mediump float;

uniform sampler2D u_image;
uniform vec4 u_color;
uniform int no_texture;
uniform int no_color;

varying vec2 v_texCoord;


void main() {
	vec4 baseTexture = texture2D(u_image, v_texCoord);
	vec4 baseColor = u_color;

	if(no_texture == 1) {
		gl_FragColor = baseColor;
	} else {
		if(no_color == 1) {
			gl_FragColor = baseTexture;
		} else {
			//gl_FragColor = baseTexture * u_color;
			float alpha = u_color.w;

			gl_FragColor = baseTexture * u_color * alpha;
		}
	}
}