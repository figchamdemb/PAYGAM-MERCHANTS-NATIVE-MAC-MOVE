try {
    const icons = require('@fortawesome/free-solid-svg-icons');
    if (icons.faShieldHalved) {
        console.log("FOUND: faShieldHalved");
    } else {
        console.log("NOT FOUND: faShieldHalved");
        if (icons.faShieldAlt) console.log("FOUND: faShieldAlt (Backup)");
    }
} catch (e) {
    console.log("Error loading icons:", e.message);
}
