import React, { Component, Fragment } from 'react'
import axios from 'axios'

import { Header, Repositories, Offline } from './styles'

class App extends Component {
  state = {
    newRepoInput: '',
    repositories: JSON.parse(localStorage.getItem('repositories')) || [],
    online: navigator.onLine,
  }

  componentDidMount() {
    window.addEventListener('online', this.handleNetworkChange)
    window.addEventListener('offline', this.handleNetworkChange)
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleNetworkChange)
    window.removeEventListener('offline', this.handleNetworkChange)
  }

  handleNetworkChange = () => {
    this.setState({ online: navigator.onLine })
  }

  addRepository = async () => {
    if (!this.state.newRepoInput) return

    if (!this.state.online) {
      alert('Você está offline, conecte-se para adicionar um repositório')
      return
    }

    const response = await axios.get(`https://api.github.com/repos/${this.state.newRepoInput}`)
    this.setState({ newRepoInput: '', repositories: [...this.state.repositories, response.data] })

    localStorage.setItem('repositories', JSON.stringify(this.state.repositories))
  }

  render() {
    return (
      <Fragment>
        <Header>
          <input
            aria-label="Adicionar repositório"
            placeholder="Adicionar repositório"
            onChange={e => this.setState({ newRepoInput: e.target.value })}
            value={this.state.newRepoInput}
          />
          <button onClick={this.addRepository}>Adicionar</button>
        </Header>
        <Repositories>
          {this.state.repositories.map(repository => (
            <li key={repository.id}>
              <img alt={repository.name} src={repository.owner.avatar_url} />
              <div>
                <strong>{repository.name}</strong>
                <p>{repository.description}</p>
                <a href={repository.html}>Acessar</a>
              </div>
            </li>
          ))}
        </Repositories>
        {!this.state.online && <Offline>Você está offline</Offline>}
      </Fragment>
    )
  }
}

export default App
