"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from '../mainPage.module.css';
import DatePicker from 'react-datepicker';

const Page = () => {
  const router = useRouter();
  const [speciesList, setSpeciesList] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [ownersList, setOwnersList] = useState([]);
  const [petsList, setPetsList] = useState([]);
  const [newSpecies, setNewSpecies] = useState('');
  const [newBreed, setNewBreed] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [newPet, setNewPet] = useState('');
  const [selectedBreed, setSelectedBreed] = useState('');
  const [activeSection, setActiveSection] = useState('');
  const [viewType, setViewType] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState('');
  const [ownerContactDetails, setOwnerContactDetails] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [petDateOfBirth, setPetDateOfBirth] = useState('');
  const [SpeciesID, setSpeciesID] = useState('');
  const [BreedID, setBreedID] = useState('');
  const [OwnerID, setOwnerID] = useState('');
  const [dashboardContent, setDashboardContent] = useState('');
  const formattedDate = petDateOfBirth ? new Date(petDateOfBirth).toISOString().split('T')[0] : '';

  const dropdownRef = useRef(null);

  const fetchData = async () => {
    try {
      const [speciesResponse, breedsResponse, ownersResponse, petsResponse] = await Promise.all([
        axios.get('http://localhost/petsApi/species.php'),
        axios.get('http://localhost/petsApi/breeds.php'),
        axios.get('http://localhost/petsApi/owners.php'),
        axios.get('http://localhost/petsApi/pets.php')
      ]);

      setSpeciesList(speciesResponse.data || []);
      setBreeds(breedsResponse.data || []);
      setOwnersList(ownersResponse.data || []);
      setPetsList(petsResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);
  
  const handleDisplayPets = async (type) => {
    try {
      const response = await axios.get(`http://localhost/petsApi/pets.php?view=${type}`);
      setPetsList(response.data);
      setViewType(type);
      setActiveSection('');
      setShowDropdown(false);
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };

  const handleDisplayOwner = async (type) => {
    try {
      const response = await axios.get(`http://localhost/petsApi/owners.php?view=${type}`);
      setOwnersList(response.data);
      setViewType(type);
      setActiveSection('');
      setShowDropdown(false);
    } catch (error) {
      console.log('Error fetching owners:', error);
    }
  };

  const handleDisplayBreeds = async (type) => {
    try {
      const response = await axios.get(`http://localhost/petsApi/breeds.php?view=${type}`);
      setBreeds(response.data);
      setViewType(type);
      setActiveSection('');
      setShowDropdown(false);
    } catch (error) {
      console.log('Error fetching breeds:', error);
    }
  };

  const handleDisplaySpecies = async (type) => {
    try {
      const response = await axios.get(`http://localhost/petsApi/species.php?view=${type}`);
      setSpeciesList(response.data);
      setViewType(type);
      setActiveSection('');
      setShowDropdown(false);
    } catch (error) {
      console.error('Error fetching species:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    router.push('/');
  };

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddSpecies = async () => {
    try {
      const response = await fetch('http://localhost/petsApi/species.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ SpeciesName: newSpecies }),
      });

      const result = await response.json();
      console.log(result.message);
      setNewSpecies('');
      fetchData();
    } catch (error) {
      console.error('Error adding species:', error);
    }
  };

  
  const handleAddBreed = async () => {
    console.log('SpeciesID:', SpeciesID);
    console.log('BreedName:', newBreed);
  
    if (!SpeciesID || !newBreed.trim()) {
      alert('Please select a species and enter a breed name.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost/petsApi/breeds.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          SpeciesID,
          BreedName: newBreed,
        }),
      });
  
      const result = await response.json();
      console.log(result.message || result.error);
      setNewBreed('');
      fetchData();
    } catch (error) {
      console.error('Error adding breed:', error);
    }
  };
  
  

  const handleAddOwner = async () => {
    try {
      const response = await fetch('http://localhost/petsApi/owners.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newOwner,
          contactDetails: ownerContactDetails,
          address: ownerAddress,
        }),
      });
  
      const result = await response.json();
      if (result.error) {
        console.error('Error adding owner:', result.error);
      } else {
        console.log(result.message);
        setNewOwner('');
        setOwnerContactDetails('');
        setOwnerAddress('');
        fetchData(); 
      }
    } catch (error) {
      console.error('Error adding owner:', error);
    }
  };
  

  const handleAddPet = async () => {
    const formattedDate = petDateOfBirth ? new Date(petDateOfBirth).toISOString().split('T')[0] : '';
  
    console.log('Formatted Date:', formattedDate);
  
    const petData = {
      Name: newPet,
      SpeciesID: SpeciesID || null,
      BreedID: selectedBreed || null,
      DateOfBirth: formattedDate,
      OwnerID: OwnerID || null,
    };
  
    try {
      const response = await fetch('http://localhost/petsApi/pets.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(petData),
      });
  
      const result = await response.json();
  
      if (response.ok && result.status === 1) {
        alert('Pet added successfully');
        setNewPet('');
        setPetDateOfBirth('');
        setSpeciesID('');
        setSelectedBreed('');
        setPetDateOfBirth('')
        setOwnerID('');
        console.log('Pet added:', result); 
      } else {
        alert('Save failed: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding pet:', error);
      alert('Save failed: ' + (error.message || 'Unknown error'));
    }
  };
  



  return (
    <div>
      <header className={styles.header}>
        <h1>Pet Web App</h1>
      </header>

      <div className={styles.container}>
        <div className={styles.dashboardCard}>
          <div className={styles.companyHeader}>
            <div className={styles.companyName}>Pet Management Co.</div>
            <p>Welcome, {username || 'Guest'}!</p>
          </div>
          <button className={styles.dashboardButton} onClick={() => {
            setActiveSection('dashboard');
            setViewType('');
            setDashboardContent(' kyutt furr babies you love!'); 
          }}>
            <i className="fas fa-tachometer-alt"></i> Dashboard
          </button>
          <button className={styles.addButton} onClick={() => { setActiveSection('species'); setViewType(''); }}>
            <i className="fas fa-paw"></i> Add Species
          </button>
          <button className={styles.addButton} onClick={() => { setActiveSection('breed'); setViewType(''); }}>
            <i className="fas fa-bone"></i> Add Breed
          </button>
          <button className={styles.addButton} onClick={() => { setActiveSection('owner'); setViewType(''); }}>
            <i className="fas fa-user"></i> Add Owner
          </button>
          <button className={styles.addButton} onClick={() => { setActiveSection('pet'); setViewType(''); }}>
            <i className="fas fa-pet"></i> Add Pet
          </button>

          <div className={styles.dropdownContainer} ref={dropdownRef}>
            <button className={styles.displayButton} onClick={toggleDropdown}>
              <i className="fas fa-list"></i> Display
            </button>
            {showDropdown && (
              <ul className={styles.dropdownMenu}>
                <li onClick={() => handleDisplaySpecies('bySpecies')}>Species</li>
                <li onClick={() => handleDisplayBreeds('byBreeds')}>Breeds</li>
                <li onClick={() => handleDisplayOwner('byOwner')}>Owners</li>
                <li onClick={() => handleDisplayPets('byPets')}>Pets</li>
              </ul>
            )}
          </div>

          <button className={styles.logoutButton} onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>

        <div className={styles.formContainer}>
          {activeSection === 'species' && (
            <div>
              <h2>Add New Species</h2>
              <input
                type="text"
                value={newSpecies}
                onChange={(e) => setNewSpecies(e.target.value)}
                placeholder="Species Name"
              />
              <button className={styles.saveButton} onClick={handleAddSpecies}>
                Save
              </button>
            </div>
          )}

          {activeSection === 'breed' && (
            <div>
              <h2>Add New Breed</h2>
              <select
                value={SpeciesID}
                onChange={(e) => setSpeciesID(e.target.value)}
              >
                <option value="">Select Species</option>
                {speciesList.map((species) => (
                  <option key={species.SpeciesID} value={species.SpeciesID}>
                    {species.SpeciesName}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={newBreed}
                onChange={(e) => setNewBreed(e.target.value)}
                placeholder="Breed Name"
              />
              <button className={styles.saveButton} onClick={handleAddBreed}>
                Save
              </button>
            </div>
          )}

          {activeSection === 'owner' && (
            <div>
              <h2>Add New Owner</h2>
              <input
                type="text"
                value={newOwner}
                onChange={(e) => setNewOwner(e.target.value)}
                placeholder="Owner Name"
              />
              <input
                type="text"
                value={ownerContactDetails}
                onChange={(e) => setOwnerContactDetails(e.target.value)}
                placeholder="Contact Details"
              />
              <input
                type="text"
                value={ownerAddress}
                onChange={(e) => setOwnerAddress(e.target.value)}
                placeholder="Address"
              />
              <button className={styles.saveButton} onClick={handleAddOwner}>
                Save
              </button>
            </div>
          )}
          {activeSection === 'dashboard' && (
            
            <div>
              <h2>{dashboardContent}</h2>
              <img src="/images/1.jpg" alt="Dashboard Image" style={{ maxWidth: '16%', height:'60%' , marginTop: '10px' }} />
              <img src="/images/2.jpg" alt="Dashboard Image" style={{ maxWidth: '19%', height:'60%' , marginTop: '10px' }} />

            </div>
            
          )}

          {activeSection === 'pet' && (
            <div>
              <h2>Add New Pet</h2>
              <input
                type="text"
                value={newPet}
                onChange={(e) => setNewPet(e.target.value)}
                placeholder="Pet Name"
              />
              <select
                value={SpeciesID}
                onChange={(e) => setSpeciesID(e.target.value)}
              >
                <option value="">Select Species</option>
                {speciesList.map((species) => (
                  <option key={species.SpeciesID} value={species.SpeciesID}>
                    {species.SpeciesName}
                  </option>
                ))}
              </select>
              <select
                value={selectedBreed}
                onChange={(e) => setSelectedBreed(e.target.value)}
              >
                <option value="">Select Breed</option>
                {breeds.map((breed) => (
                  <option key={breed.BreedID} value={breed.BreedID}>
                    {breed.BreedName}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={petDateOfBirth}
                onChange={(e) => setPetDateOfBirth(e.target.value)}
                placeholder="Date of Birth"
              />

              {/* <DatePicker
              
                selected={petDateOfBirth}
                onChange={(date) => setPetDateOfBirth(date)}
                placeholderText='Select Pet Date Of Birth'
                dateFormat="MMMM d, yyyy"
                style={{zIndex:9999, position:"relative"}}
              /> */}
              <select
                value={OwnerID}
                onChange={(e) => setOwnerID(e.target.value)}
              >
                <option value="">Select Owner</option>
                {ownersList.map((owner) => (
                  <option key={owner.OwnerID} value={owner.OwnerID}>
                    {owner.OwnerName}
                  </option>
                ))}
              </select>
              <button className={styles.saveButton} onClick={handleAddPet}>
                Save
              </button>
            </div>
          )}

          {viewType === 'bySpecies' && (
            <div className={styles.activeSection}>
              <h2>All Species</h2>
              <table className={styles.speciesTable}>
                <thead>
                  <tr>
                    <th>Species Name</th>
                  </tr>
                </thead>
                <tbody>
                  {speciesList.map((species) => (
                    <tr key={species.SpeciesID}>
                      <td>{species.SpeciesName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {viewType === 'byBreeds' && (
            <div className={styles.activeSection}>
              <h2>All Breeds</h2>
              <table className={styles.breedsTable}>
                <thead>
                  <tr>
                    <th>Species Name</th>
                    <th>Breed Name</th>
                  </tr>
                </thead>
                <tbody>
                  {breeds.map((breed) => (
                    <tr key={breed.BreedID}>
                      <td>{speciesList.find((species) => species.SpeciesID === breed.SpeciesID)?.SpeciesName}</td>
                      <td>{breed.BreedName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {viewType === 'byOwner' && (
            <div className={styles.activeSection}>
              <h2>All Owners</h2>
              <table className={styles.ownersTable}>
                <thead>
                  <tr>
                    <th>Owner Name</th>
                    <th>Contact Details</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  {ownersList.map((owner) => (
                    <tr key={owner.OwnerID}>
                      <td>{owner.OwnerName}</td>
                      <td>{owner.ContactDetails}</td>
                      <td>{owner.Address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {viewType === 'byPets' && (
            <div className={styles.activeSection}>
              <h2>All Pets</h2>
              <table className={styles.petsTable}>
                <thead>
                  <tr>
                    <th>Pet Name</th>
                    <th>Species Name</th>
                    <th>Breed Name</th>
                    <th>Owner Name</th>
                    <th>Date of Birth</th>
                  </tr>
                </thead>
                <tbody>
                  {petsList.map((pet) => (
                    <tr key={pet.PetID}>
                      <td>{pet.Name}</td>
                      <td>{speciesList.find((species) => species.SpeciesID === pet.SpeciesID)?.SpeciesName}</td>
                      <td>{breeds.find((breed) => breed.BreedID === pet.BreedID)?.BreedName}</td>
                      <td>{ownersList.find((owner) => owner.OwnerID === pet.OwnerID)?.OwnerName}</td>
                      <td>{pet.DateOfBirth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
