import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import alias from 'rollup-plugin-alias';
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';

const license = `/**
 * Push v1.0
 * =========
 * A compact, cross-browser solution for the JavaScript Notifications API
 *
 * Credits
 * -------
 * Tsvetan Tsvetkov (ttsvetko)
 * Alex Gibson (alexgibson)
 *
 * License
 * -------
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2015-2017 Tyler Nickerson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */`;

const common = {
    input: 'src/index.js',
    output: {
        format: 'umd',
        name: 'Push',
        sourcemap: true
    },
    banner: license,
    plugins: [
        babel({
            exclude: 'node_modules/**'
        }),
        alias({
            types: path.resolve(__dirname, 'src/types'),
            push: path.resolve(__dirname, 'src/push/index'),
            agents: path.resolve(__dirname, 'src/agents/index')
        }),
        commonjs(),
        resolve()
    ]
};

export default [
    {
        ...common,
        output: {
            ...common.output,
            file: 'bin/push.js'
        }
    },
    {
        ...common,
        output: {
            ...common.output,
            file: 'bin/push.min.js'
        },
        plugins: [
            ...common.plugins,
            uglify(
                {
                    output: {
                        beautify: false,
                        preamble: license
                    }
                },
                minify
            )
        ]
    }
];
