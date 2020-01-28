const React = require('react');
const PropTypes = require('prop-types');

const stateHandler = require('../../state/index');

class DivisionControlsComponent extends React.PureComponent {

	constructor(props) {
		super(props);
	}

	handleDeleteButtonClick = (e) => {
		console.log('delete-division button click');
		e.preventDefault();
		e.stopPropagation();

		const activityIndex = stateHandler.state.procedure
			.TasksHandler.getTaskIndexByUuid(this.props.activityUuid);

		const divisionIndex = stateHandler.state.procedure.tasks[activityIndex]
			.getDivisionIndexByUuid(this.props.divisionUuid);

		// this.props.deleteDivision(divisionIndex);
		const activity = stateHandler.state.procedure.tasks[activityIndex];
		console.log(`deleting division index ${divisionIndex}`);
		console.log(activity.concurrentSteps[divisionIndex]);

		activity.deleteDivision(divisionIndex);

		stateHandler.saveChange(activityIndex);
	}

	handleInsertButtonClick = (e) => {
		console.log('insert-division button click');
		e.preventDefault();
		e.stopPropagation();

		const activityIndex = stateHandler.state.procedure
			.TasksHandler.getTaskIndexByUuid(this.props.activityUuid);

		const divisionIndex = stateHandler.state.procedure.tasks[activityIndex]
			.getDivisionIndexByUuid(this.props.divisionUuid);

		// this.props.insertDivision(divisionIndex);
		const activity = stateHandler.state.procedure.tasks[activityIndex];
		activity.insertDivision(divisionIndex);

		stateHandler.saveChange(activityIndex);
	}

	// Fixme maybe this functionality should be broken out into another component?
	handleAppendButtonClick = (e) => {
		console.log('append-division button click');
		e.preventDefault();
		e.stopPropagation();

		const activityIndex = stateHandler.state.procedure
			.TasksHandler.getTaskIndexByUuid(this.props.activityUuid);

		// this.props.insertDivision(divisionIndex);
		const activity = stateHandler.state.procedure.tasks[activityIndex];
		activity.appendDivision();

		stateHandler.saveChange(activityIndex);
	}

	render() {

		const trTdStyle = {
			height: 0,
			margin: 0,
			padding: 0,
			borderTop: 'solid transparent 0'
		};

		const wrapperStyle = {
			position: 'relative',
			height: 0
		};

		const contentDiv = {
			position: 'absolute',
			top: '-10px',
			bottom: '-10px',
			left: 0,
			right: 0

			// temporary for dev only. FIXME.
			// backgroundColor: 'red',
			// opacity: 0.2
		};

		const controlsStyle = {
			position: 'absolute',
			backgroundColor: '#eee',
			right: '3px',
			top: '-10px'
		};

		return (
			<tr style={trTdStyle} className='division-controls-tr'>
				<td colSpan="3" style={trTdStyle}>
					<div style={wrapperStyle}>
						<div
							style={contentDiv}
							className='division-controls'
						>
							<div className='modify-division-hoverbox'></div>
							<div style={controlsStyle} className='modify-division-container'>
								{ this.props.divisionUuid !== 'last' ?
									(
										<React.Fragment>
											<button
												onClick={this.handleDeleteButtonClick}
												className='delete-button'
											>
												delete sync block
											</button>
											<button
												onClick={this.handleInsertButtonClick}
												className='insert-division-button'
											>
												insert sync block
											</button>
										</React.Fragment>
									) :
									(
										<button
											onClick={this.handleAppendButtonClick}
											className='insert-division-button'
										>
											insert sync block at end
										</button>
									)
								}
							</div>
						</div>
					</div>
				</td>
			</tr>
		);
	}

}

DivisionControlsComponent.propTypes = {
	// activityIndex: PropTypes.number.isRequired,
	activityUuid: PropTypes.string.isRequired,
	// divisionIndex: PropTypes.number.isRequired,
	divisionUuid: PropTypes.string.isRequired
	// deleteDivision: PropTypes.func.isRequired,
	// insertDivision: PropTypes.func.isRequired
};

module.exports = DivisionControlsComponent;