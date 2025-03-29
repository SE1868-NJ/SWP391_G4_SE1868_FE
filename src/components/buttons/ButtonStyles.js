// src/components/Button/ButtonStyles.js
export const ButtonStyles = {
    // Style cơ bản cho tất cả các button
    baseStyle: {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'all 0.3s ease',
    },

    // Các biến thể của button
    variants: {
        // Style cho button login
        login: {
            backgroundColor: '#4CAF50',
            color: 'white',
            fontWeight: 'bold',
            '&:hover': {
                backgroundColor: '#4A753E',
            }
        },

        // Style cho button category
        category: {
            backgroundColor: '#6c757d',
            color: 'white',
            margin: '5px',
            minWidth: '150px',
            '&:hover': {
                backgroundColor: '#5a6268',
            }
        },

        // Style cho button default
        default: {
            backgroundColor: '#f0f0f0',
            color: '#333',
            '&:hover': {
                backgroundColor: '#e0e0e0',
            }
        }
    },

    // Các kích thước button
    sizes: {
        small: {
            padding: '8px 16px',
            fontSize: '14px',
        },
        medium: {
            padding: '10px 20px',
            fontSize: '16px',
        },
        large: {
            padding: '12px 24px',
            fontSize: '18px',
        }
    }
};

