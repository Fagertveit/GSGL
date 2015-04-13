precision mediump float;

uniform sampler2D u_image;
uniform vec4 u_color;
uniform int no_texture;

varying vec2 v_texCoord;

void main() {
	vec4 baseTexture = texture2D(u_image, v_texCoord);
	vec4 baseColor = u_color;
	
	if(no_texture == 1) {
		gl_FragColor = baseColor;
	}
	else {
		gl_FragColor = baseTexture;
	}
}