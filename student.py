#!/usr/bin/python
# -*- coding: utf-8 -*-
import socket
import sys
from inputs import get_gamepad

THRESHOLD = 16000  # Minimum value to recognize as joy stick movement
msg = ''
state = 0
zoom_state = 0
dir = 0
tilt_state = 0
pan_state = 0
try:
    server_addr = (sys.argv[1], int(sys.argv[2]))
except Exception as e:
    print('Proper use is: python student.py hostname port')
    sys.exit()

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
try:
    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    s.connect(server_addr)
except Exception as e:
    print(e)
    sys.exit()

while True:
    events = get_gamepad()
    for event in events:

        # Check for button presses

        if 'BTN_TL' in event.code:
            if event.state == 1:
                zoom_state = 1
            else:
                zoom_state = 0
        elif 'BTN_TR' in event.code:
            if event.state == 1:
                zoom_state = 2
            else:
                zoom_state = 0
        elif 'BTN_SOUTH' in event.code:
            if event.state == 1:
                msg = 'A Pressed'
                if state == 0:
                    state = 1
                elif state == 1:
                    state = 0
                elif state == 2:
                    state = 3
                elif state == 3:
                    state = 2
            else:
                msg = 'A Released'
        elif 'BTN_NORTH' in event.code:
            if event.state == 1:
                msg = 'Y Pressed'
            else:
                msg = 'Y Released'
        elif 'BTN_WEST' in event.code:
            if event.state == 1:
                msg = 'X Pressed'
            else:
                msg = 'X Released'
        elif 'BTN_EAST' in event.code:
            if event.state == 1:
                msg = 'B Pressed'
                if state == 0:
                    state = 2
                elif state == 1:
                    state = 3
                elif state == 2:
                    state = 0
                elif state == 3:
                    state = 1
            else:
                msg = 'B Released'
        elif abs(event.state) > THRESHOLD:

        # Check for joy stick movement

            if 'ABS_RX' in event.code:
                if event.state >= THRESHOLD:
                    pan_state = 2
                elif event.state < -1 * THRESHOLD:
                    pan_state = 1
            elif 'ABS_RY' in event.code:
                if event.state >= THRESHOLD:
                    tilt_state = 1
                elif event.state < -1 * THRESHOLD:
                    tilt_state = 2
            elif 'ABS_X' in event.code:
                msg = 'Left Stick X: ' + str(event.state)

                if event.state >= THRESHOLD:

                    # print('RIGHT DIRECTION')

                    dir = 1
                elif event.state < -1 * THRESHOLD:

                    # print('LEFT DIRECTION')

                    dir = 2
        elif abs(event.state) < THRESHOLD and 'ABS_X' in event.code:
            dir = 0

        try:
            state_str = str(state) + str(dir) + str(zoom_state) \
                + str(tilt_state) + str(pan_state)
            print(state_str)
            s.sendall(state_str.encode())
        finally:
            pass

# s.close()
