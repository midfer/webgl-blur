function mfGetWebGLContext(canvas, attributes) {
    var types = ["webgl", "experimental-webgl"]
    for (var i = 0; i < types.length; i++) {
        var gl = canvas.getContext(types[i], attributes)
        if (gl) return gl
    }

    return null
}

function mfCreateShader(gl, type, source) {
    var shader = gl.createShader(type)
    if (shader == null) {
        console.log('Failed to create shader')
        return null
    }

    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if (!compiled) {
        var error = gl.getShaderInfoLog(shader)
        console.log('Failed to compile shader: ' + error)
        gl.deleteShader(shader)
        return null
    }

    return shader
}

function mfCreateProgram(gl, vshader, fshader) {
    var vert = mfCreateShader(gl, gl.VERTEX_SHADER, vshader)
    var frag = mfCreateShader(gl, gl.FRAGMENT_SHADER, fshader)
    if (!vert || !frag) {
        return null
    }

    var program = gl.createProgram()
    if (!program) {
        return null
    }

    gl.attachShader(program, vert)
    gl.attachShader(program, frag)

    gl.linkProgram(program)

    var linked = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (!linked) {
        var error = gl.getProgramInfoLog(program)
        console.log('Failed to link program: ' + error)
        gl.deleteProgram(program)
        gl.deleteShader(frag)
        gl.deleteShader(vert)
        return null
    }

    return program
}
