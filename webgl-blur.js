
function mfCreatePlane() {
    var mesh = {}
    mesh.vertices = new Float32Array([
        1.0, 1.0, 0.0,
        -1.0, 1.0, 0.0,
        -1.0,-1.0, 0.0,
        1.0,-1.0, 0.0,
    ])

    mesh.normals = new Float32Array([
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
    ])

    mesh.textureCoords = new Float32Array([
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
    ])

    mesh.indices = new Uint16Array([
        0, 1, 2,
        0, 2, 3,
    ])

    return mesh
}

function mfInitProgram(gl, program, properties) {
    var uniforms = properties.uniforms
    if (uniforms != null) {
        for (var k in uniforms) {
            program[uniforms[k]] = gl.getUniformLocation(program, uniforms[k])
            if (program[uniforms[k]] < 0) {
                console.log('can not find ' + uniforms[k] + ' in shader')
            }
        }
    }

    var attribs = properties.attribs
    if (attribs) {
        for (var k in attribs) {
            program[attribs[k]] = gl.getAttribLocation(program, attribs[k])
            if (program[attribs[k]] < 0) {
                console.log('can not find ' + attribs[k] + ' in shader')
            }
        }
    }
}

function initTextureForLaterUse(gl, image) {
    var texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    gl.bindTexture(gl.TEXTURE_2D, null)
    return texture
}

function mfInitBufferForLaterUse(gl, type, data) {
    var buffer = gl.createBuffer()
    gl.bindBuffer(type, buffer)
    gl.bufferData(type, data, gl.STATIC_DRAW)
    gl.bindBuffer(type, null)
    return buffer
}

function mfInitFrameBufferForLaterUse(gl, program, frameBufferName, textureBufferName, textureWidth, textureHeight) {
    program[frameBufferName] = gl.createFramebuffer()
    program[textureBufferName] = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, program[textureBufferName])

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, textureWidth, textureHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    gl.bindTexture(gl.TEXTURE_2D, null)
}

function mfDrawToTexture2D(gl, frameBuffer, textureBuffer, bufferWidth, bufferHeight, drawFunc) {
    var orign = gl.getParameter(gl.VIEWPORT)
    gl.viewport(orign[0], orign[1], bufferWidth, bufferHeight)
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, textureBuffer, 0)
    if(gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
        console.log("bind textureBuffer to framebuffer failed: gl.TEXTURE_2D")
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)
        gl.viewport(orign[0], orign[1], orign[2], orign[3])
        return
    }

    gl.clear(gl.COLOR_BUFFER_BIT)

    drawFunc()

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(orign[0], orign[1], orign[2], orign[3])
}


function mfGaussMatrix(radius, sigma) {
    var gaussMatrix = new Array()
    var sum = 0
    for (var x = -radius; x <= radius; x++) {
        var deno = 1.0 / (sigma * Math.sqrt(2.0 * Math.PI))
        var nume = -(x * x) / (2.0 * sigma * sigma)
        var g = deno * Math.exp(nume)
        gaussMatrix.push(g)
        sum += g
    }

    for (var i = 0; i < gaussMatrix.length; i++) {
        gaussMatrix[i] /= sum
    }

    return gaussMatrix
}
