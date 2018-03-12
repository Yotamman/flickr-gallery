import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';

class Image extends React.Component {
    static propTypes = {
      dto: PropTypes.object,
      galleryWidth: PropTypes.number
    };

    constructor(props) {
      super(props);
      this.calcImageSize = this.calcImageSize.bind(this);
      this.rotate = this.rotate.bind(this);
      this.delete = this.delete.bind(this);
      this.state = {
        size: 200,
        rotation: 0,
        showImage: true
      };
    }

    calcImageSize() {
      const {galleryWidth} = this.props;
      const targetSize = 200;
      const imagesPerRow = Math.round(galleryWidth / targetSize);
      const size = (galleryWidth / imagesPerRow);
      this.setState({
        size
      });
    }

    componentDidMount() {
      this.calcImageSize();
    }

    urlFromDto(dto) {
      return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
    }

    rotate(){
      let newRotation = this.state.rotation + 90;
      if(newRotation >= 360){
        newRotation =- 360;
      }
      this.setState({
        rotation: newRotation
      })
    }

    expand(){
      alert('expand!!!!');
    }

    delete(){
      this.setState({
        showImage: false//changes the state of the componenat to not show the image
      });
    }

  render() {
      const { rotation } =  this.state;
      const { showImage } = this.state;
      var noButton = {
           backgroundColor: 'Transparent',
           outline: 'none',
           border: 'none',
           overflow: 'hidden',
           padding:0
    }//this style is in order to remove the button component GUI

    if(showImage){//Conditional Rendering, wether to show or not the picture
      var showImageSt = {
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: this.state.size + 'px',
          height: this.state.size + 'px',
          transform: `rotate(${rotation}deg)`
      }
    }
    return (
              <div className="image-root" style={showImageSt}>
              <div style={{transform: `rotate(${-rotation}deg)`}}>
                <button style={noButton} onClick={this.rotate}>
                    <FontAwesome className="image-icon" name="sync-alt" title="Rotate"/>
                </button>
                <button style={noButton} onClick={this.delete}>
                    <FontAwesome className="image-icon" name="trash-alt" title="delete"/>
                </button>
                <button style={noButton} onClick={this.expand}>
                    <FontAwesome className="image-icon" name="expand" title="expand"/>
                </button>
              </div>
            </div>
    );
  }
}

export default Image;