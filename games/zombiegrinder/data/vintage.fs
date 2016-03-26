/// <summary>
/// Copyright (C) 2012 Nathaniel Meyer
/// Nutty Software, http://www.nutty.ca
/// All Rights Reserved.
///
/// 2D Noise
/// Author : Ian McEwan, Ashima Arts.
///	Copyright (C) 2011 Ashima Arts. All rights reserved.
/// Distributed under the MIT License.
///	https://github.com/ashima/webgl-noise
/// 
/// Permission is hereby granted, free of charge, to any person obtaining a copy of
/// this software and associated documentation files (the "Software"), to deal in
/// the Software without restriction, including without limitation the rights to
/// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
/// of the Software, and to permit persons to whom the Software is furnished to do
/// so, subject to the following conditions:
///     1. The above copyright notice and this permission notice shall be included in all
///        copies or substantial portions of the Software.
///     2. Redistributions in binary or minimized form must reproduce the above copyright
///        notice and this list of conditions in the documentation and/or other materials
///        provided with the distribution.
/// 
/// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
/// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
/// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
/// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
/// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
/// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
/// SOFTWARE.
/// </summary>


#ifdef GL_ES
	precision highp float;
#endif

uniform vec2 u_imageSize;
uniform vec2 u_texelSize;
uniform vec4 u_color;
uniform sampler2D u_image;

uniform float u_sepia;
uniform float u_noise;
uniform float u_scratch;
uniform float u_innerVignette;
uniform float u_outerVignette;
uniform float u_random;
uniform float u_timeLapse;

varying vec2 v_texCoord;

vec3 Overlay (vec3 src, vec3 dst)
{
	// if (dst <= ½) then: 2 * src * dst
	// if (dst > ½) then: 1 - 2 * (1 - dst) * (1 - src)
	return vec3((dst.x <= 0.5) ? (2.0 * src.x * dst.x) : (1.0 - 2.0 * (1.0 - dst.x) * (1.0 - src.x)),
				(dst.y <= 0.5) ? (2.0 * src.y * dst.y) : (1.0 - 2.0 * (1.0 - dst.y) * (1.0 - src.y)),
				(dst.z <= 0.5) ? (2.0 * src.z * dst.z) : (1.0 - 2.0 * (1.0 - dst.z) * (1.0 - src.z)));
}

/// <summary>
/// 2D Noise by Ian McEwan, Ashima Arts.
/// <summary>
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
float snoise (vec2 v)
{
	const vec4 C = vec4(0.211324865405187,	// (3.0-sqrt(3.0))/6.0
						0.366025403784439,	// 0.5*(sqrt(3.0)-1.0)
						-0.577350269189626,	// -1.0 + 2.0 * C.x
						0.024390243902439);	// 1.0 / 41.0

	// First corner
	vec2 i  = floor(v + dot(v, C.yy) );
	vec2 x0 = v -   i + dot(i, C.xx);

	// Other corners
	vec2 i1;
	i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
	vec4 x12 = x0.xyxy + C.xxzz;
	x12.xy -= i1;

	// Permutations
	i = mod289(i); // Avoid truncation effects in permutation
	vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
		+ i.x + vec3(0.0, i1.x, 1.0 ));

	vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
	m = m*m ;
	m = m*m ;

	// Gradients: 41 points uniformly over a line, mapped onto a diamond.
	// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

	vec3 x = 2.0 * fract(p * C.www) - 1.0;
	vec3 h = abs(x) - 0.5;
	vec3 ox = floor(x + 0.5);
	vec3 a0 = x - ox;

	// Normalise gradients implicitly by scaling m
	// Approximation of: m *= inversesqrt( a0*a0 + h*h );
	m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

	// Compute final noise value at P
	vec3 g;
	g.x  = a0.x  * x0.x  + h.x  * x0.y;
	g.yz = a0.yz * x12.xz + h.yz * x12.yw;
	return 130.0 * dot(m, g);
}

/// <summary>
/// Fragment shader entry.
/// <summary>
void main ()
{
	// Sepia RGB value
	vec3 sepia = vec3(112.0 / 255.0, 66.0 / 255.0, 20.0 / 255.0);

	// Step 1: Convert to grayscale
	vec3 colour = texture2D(u_image, v_texCoord).xyz;
	float gray = (colour.x + colour.y + colour.z) / 3.0;
	vec3 grayscale = vec3(colour);
	
	// Step 2: Appy sepia overlay
	vec3 finalColour = Overlay(sepia, grayscale);
	
	// Step 3: Lerp final sepia colour
	finalColour = grayscale + u_sepia * (finalColour - grayscale);
	
	// Step 4: Add noise
	float noise = snoise(v_texCoord * vec2(1024.0 + u_random * 512.0, 1024.0 + u_random * 512.0)) * 0.5;
	finalColour += noise * u_noise;
	
	// Optionally add noise as an overlay, simulating ISO on the camera
	//vec3 noiseOverlay = Overlay(finalColour, vec3(noise));
	//finalColour = finalColour + NoiseValue * (finalColour - noiseOverlay);
	
	// Step 5: Apply scratches
	if ( u_random < u_scratch )
	{
		// Pick a random spot to show scratches
		float dist = 1.0 / u_scratch;
		float d = distance(v_texCoord, vec2(u_random * dist, u_random * dist));
		if ( d < 0.4 )
		{
			// Generate the scratch
			float xPeriod = 8.0;
			float yPeriod = 1.0;
			float pi = 3.141592;
			float phase = u_timeLapse;
			float turbulence = snoise(v_texCoord * 2.5);
			float vScratch = 0.5 + (sin(((v_texCoord.x * xPeriod + v_texCoord.y * yPeriod + turbulence)) * pi + phase) * 0.5);
			vScratch = clamp((vScratch * 10000.0) + 0.35, 0.0, 1.0);

			finalColour.xyz *= vScratch;
		}
	}
	
	// Step 6: Apply vignetting
	// Max distance from centre to corner is ~0.7. Scale that to 1.0.
	float d = distance(vec2(0.5, 0.5), v_texCoord) * 1.414213;
	float vignetting = clamp((u_outerVignette - d) / (u_outerVignette - u_innerVignette), 0.0, 1.0);
	finalColour.xyz *= vignetting;
	
	// Apply colour
	gl_FragColor.xyz = finalColour;
	gl_FragColor.w = 1.0;
}