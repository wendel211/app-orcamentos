import React from 'react';
import {
    ActivityIndicator,
    ActivityIndicatorProps,
    Pressable,
    PressableProps,
    Text,
    TextInput,
    TextInputProps,
    TextProps,
    View,
    ViewProps,
} from 'react-native';
import { createButton, createInput, createPressable } from '@gluestack-ui/core';

export const GSButton = createButton<
    PressableProps,
    TextProps,
    ViewProps,
    ActivityIndicatorProps,
    ViewProps
>({
    Root: Pressable,
    Text,
    Group: View,
    Spinner: ActivityIndicator,
    Icon: View,
});

export const GSInput = createInput<ViewProps, ViewProps, PressableProps, TextInputProps>({
    Root: View,
    Icon: View,
    Slot: Pressable,
    Input: TextInput,
});

export const GSPressable = createPressable<PressableProps>({
    Root: Pressable,
});
