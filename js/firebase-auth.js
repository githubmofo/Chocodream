// Firebase Auth + Realtime DB helpers (v8 compat API expected)
// This script attaches handlers to the login/signup forms in `login.html`.
// It expects the Firebase SDK (firebase-app.js, firebase-auth.js, firebase-database.js)
// to be loaded before this file, and `js/firebase-app.js` to have run to initialize the app.

(function(){
  function showToast(msg) {
    let t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'), 3000);
  }

  function writeUserProfile(uid, profile) {
    if (!firebase || !firebase.database) return Promise.resolve();
    return firebase.database().ref('users/' + uid).set(profile);
  }

  function onAuthStateChanged(user) {
    if (user) {
      console.log('User signed in', user.uid);
      // Fetch user profile and update navbar
      if (window.fetchUserProfile && window.updateNavbarWithUsername) {
        fetchUserProfile(user.uid).then(function(profile) {
          if (profile && profile.name) {
            updateNavbarWithUsername(profile.name);
          }
        });
      }
    } else {
      console.log('No user signed in');
      // Optionally reset navbar
      if (window.updateNavbarWithUsername) {
        updateNavbarWithUsername('Login/Signup');
      }
    }
  }

  function init() {
    if (typeof firebase === 'undefined' || !firebase.auth) {
      console.warn('Firebase SDK/auth not loaded; firebase-auth will not function.');
      return;
    }

    firebase.auth().onAuthStateChanged(onAuthStateChanged);

    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = (document.getElementById('loginEmail')||{}).value || '';
        const password = (document.getElementById('loginPassword')||{}).value || '';
        if (!email || !password) { showToast('Please enter email and password'); return; }
        firebase.auth().signInWithEmailAndPassword(email, password)
          .then(res => {
            const user = res.user;
            // Fetch user profile and cache it
            if (firebase.database) {
              firebase.database().ref('users/' + user.uid).once('value').then(function(snapshot) {
                const profile = snapshot.val();
                const userName = (profile && profile.name) || user.displayName || (user.email ? user.email.split('@')[0] : '') || 'User';
                const userEmail = user.email || '';
                // Save to cache
                try {
                  localStorage.setItem('chocodream_user_cache', JSON.stringify({
                    name: userName,
                    email: userEmail,
                    uid: user.uid,
                    timestamp: Date.now()
                  }));
                } catch (e) {
                  console.warn('Failed to cache user:', e);
                }
              }).catch(function() {
                // Fallback cache
                const userName = user.displayName || (user.email ? user.email.split('@')[0] : '') || 'User';
                try {
                  localStorage.setItem('chocodream_user_cache', JSON.stringify({
                    name: userName,
                    email: user.email || '',
                    uid: user.uid,
                    timestamp: Date.now()
                  }));
                } catch (e) {
                  console.warn('Failed to cache user:', e);
                }
              });
            }
            showToast('Logged in');
            // redirect after a short delay
            setTimeout(()=> window.location.href = 'index.html', 700);
          })
          .catch(err=>{
            console.error('Login error', err);
            showToast(err.message || 'Login failed');
          });
      });
    }

    if (signupForm) {
      signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = (document.getElementById('signupName')||{}).value || '';
        const email = (document.getElementById('signupEmail')||{}).value || '';
        const password = (document.getElementById('signupPassword')||{}).value || '';
        const confirm = (document.getElementById('confirmPassword')||{}).value || '';
        
        // Clear previous errors
        const nameError = document.getElementById('signupNameError');
        const emailError = document.getElementById('signupEmailError');
        const passwordError = document.getElementById('signupPasswordError');
        const confirmError = document.getElementById('confirmPasswordError');
        if (nameError) nameError.textContent = '';
        if (emailError) emailError.textContent = '';
        if (passwordError) passwordError.textContent = '';
        if (confirmError) confirmError.textContent = '';
        
        let isValid = true;
        
        // Name validation
        if (!name) {
          if (nameError) nameError.textContent = 'Name is required';
          isValid = false;
        } else if (name.length < 3) {
          if (nameError) nameError.textContent = 'Name must be at least 3 characters long';
          isValid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(name)) {
          if (nameError) nameError.textContent = 'Name can only contain letters and spaces';
          isValid = false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
          if (emailError) emailError.textContent = 'Email is required';
          isValid = false;
        } else if (!emailRegex.test(email)) {
          if (emailError) emailError.textContent = 'Please enter a valid email address';
          isValid = false;
        }
        
        // Password validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!password) {
          if (passwordError) passwordError.textContent = 'Password is required';
          isValid = false;
        } else if (password.length < 8) {
          if (passwordError) passwordError.textContent = 'Password must be at least 8 characters';
          isValid = false;
        } else if (!passwordRegex.test(password)) {
          if (passwordError) passwordError.textContent = 'Password must contain uppercase, lowercase, and number';
          isValid = false;
        }
        
        // Confirm Password validation
        if (!confirm) {
          if (confirmError) confirmError.textContent = 'Please confirm your password';
          isValid = false;
        } else if (password !== confirm) {
          if (confirmError) confirmError.textContent = 'Passwords do not match';
          isValid = false;
        }
        
        if (!isValid) {
          showToast('Please fix the errors before submitting');
          return;
        }

        firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(result => {
            const user = result.user;
            // Save profile to Realtime Database under /users/{uid}
            const profile = {
              name: name,
              email: email,
              createdAt: firebase.database.ServerValue.TIMESTAMP
            };
            return writeUserProfile(user.uid, profile).then(()=>user);
          })
          .then(user => {
            // Save to cache
            try {
              localStorage.setItem('chocodream_user_cache', JSON.stringify({
                name: name,
                email: email,
                uid: user.uid,
                timestamp: Date.now()
              }));
            } catch (e) {
              console.warn('Failed to cache user:', e);
            }
            showToast('Account created');
            setTimeout(()=> window.location.href = 'index.html', 700);
          })
          .catch(err => {
            console.error('Signup error', err);
            showToast(err.message || 'Signup failed');
          });
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

})();
