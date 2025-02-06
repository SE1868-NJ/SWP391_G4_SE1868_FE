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
        
        return {
            ...ButtonStyles.baseStyle,
            ...ButtonStyles.variants[variant],
            ...ButtonStyles.sizes[size],
            ...(this.state.isHovered ? ButtonStyles.variants[variant]['&:hover'] : {}),
            ...style, // Custom style từ props
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