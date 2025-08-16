const Error = () => {
    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.code}>401</h1>
                <h2 style={styles.title}>Unauthorized Access</h2>
                <p style={styles.message}>
                    Sorry, you are not authorized to view this page.<br />
                    Please login with the correct credentials or contact your administrator.
                </p>
                <a href="/" style={styles.button}>Go to Home</a>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e0e7ff 0%, #f9fafb 100%)",
    },
    card: {
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        padding: "48px 36px",
        textAlign: "center",
        maxWidth: "400px",
        width: "100%",
    },
    code: {
        fontSize: "64px",
        fontWeight: "bold",
        color: "#ef4444",
        margin: 0,
    },
    title: {
        fontSize: "28px",
        fontWeight: 600,
        color: "#1e293b",
        margin: "16px 0 8px 0",
    },
    message: {
        fontSize: "16px",
        color: "#64748b",
        marginBottom: "32px",
    },
    button: {
        display: "inline-block",
        padding: "12px 32px",
        background: "#2563eb",
        color: "#fff",
        borderRadius: "8px",
        textDecoration: "none",
        fontWeight: 600,
        fontSize: "16px",
        transition: "background 0.2s",
    },
};

export default Error;