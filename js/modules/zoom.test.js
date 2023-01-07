/**
 * @jest-environment jsdom
 */

import { countZoom, getZoomInPercent } from './zoom';

test('zooming from 0.9 is 0.8', () => {
    expect(countZoom('out', 0.9)).toBe(0.8);
});

test('zooming from 0.6 is 0.7', () => {
    expect(countZoom('in', 0.6)).toBe(0.7);
});

test('scale of 0.8 is 80% zoom', () => {
    expect(getZoomInPercent(0.8)).toBe(80);
});