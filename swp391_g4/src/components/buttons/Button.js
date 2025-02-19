// src/components/buttons/Button.js
import React from 'react';
import { ButtonStyles } from './ButtonStyles.js';

class Button extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isHovered: false
        };
    }

    getButtonStyle = () => {
        const { variant = 'default', size = 'medium', style } = this.props;
        
        const variantStyles = ButtonStyles.variants[variant] || ButtonStyles.variants['default'];
        const hoverStyles = variantStyles['&:hover'] || {};
        
        return {
            ...ButtonStyles.baseStyle,
            ...variantStyles,
            ...ButtonStyles.sizes[size],
            ...(this.state.isHovered ? hoverStyles : {}),
            ...style,
        };
    };

    render() {
        const {
            children,
            variant,
            size,
            style,
            ...otherProps
        } = this.props;

        return (
            <button
                style={this.getButtonStyle()}
                onMouseEnter={() => this.setState({ isHovered: true })}
                onMouseLeave={() => this.setState({ isHovered: false })}
                {...otherProps}
            >
                {children}
            </button>
        );
    }
}

export default Button;