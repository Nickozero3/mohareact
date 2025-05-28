const WhatsappButton = ({ phone, message, children }) => {
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
    
    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-button"
            style={{
                position: 'fixed',
                bottom: '30px',
                right: '30px',
                width: '60px',
                height: '60px',
                backgroundColor: '#25D366',
                color: '#fff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                fontSize: '28px',
                fontWeight: 'bold',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                zIndex: 1001,
            }}
        >
            {children || (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="currentColor"
                >
                    <path d="M16.003 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.26.6 4.47 1.74 6.41L3.2 28.8l6.58-1.72c1.86 1.01 3.96 1.54 6.22 1.54h.01c7.06 0 12.8-5.74 12.8-12.8s-5.74-12.8-12.8-12.8zm0 23.04c-1.98 0-3.92-.53-5.61-1.53l-.4-.23-3.91 1.02 1.04-3.81-.26-.39c-1.08-1.62-1.65-3.51-1.65-5.46 0-5.51 4.49-10 10-10s10 4.49 10 10-4.49 10-10 10zm5.47-7.56c-.3-.15-1.77-.87-2.05-.97-.28-.1-.49-.15-.7.15-.2.3-.8.97-.98 1.17-.18.2-.36.22-.66.07-.3-.15-1.26-.47-2.4-1.5-.89-.79-1.49-1.76-1.67-2.06-.18-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.29.3-.48.1-.2.05-.37-.02-.52-.07-.15-.7-1.68-.96-2.3-.25-.6-.51-.52-.7-.53-.18-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.28.3-1.05 1.03-1.05 2.5 0 1.47 1.08 2.89 1.23 3.09.15.2 2.13 3.25 5.17 4.43.72.31 1.28.5 1.72.64.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.41.25-.7.25-1.3.18-1.41-.07-.11-.27-.18-.57-.33z"/>
                </svg>
            )}
        </a>
    );
}

export default WhatsappButton;