const React = require('react');
const { useDrag } = require('react-dnd');
const PropTypes = require('prop-types');
const ItemTypes = require('../../../model/ItemTypes');
// const uuidv4 = require('uuid/v4');

const SummaryTimelineBlockDropLocationComponent = require('./SummaryTimelineBlockDropLocationComponent');
// const ReactTimelineWriter = require('../../../writer/timeline/ReactTimelineWriter');

const stateHandler = require('../../state/index');

const SummaryTimelineComponent = ({
	height, fillColor, textSize, marginTop, title, duration, uuid, minutesGap, columnIndex,

	updateCurrentActivity, showTimeline
}) => {

	const blockStyle = {
		height: `${height}px`,
		backgroundColor: fillColor,
		fontSize: `${textSize}px`,
		position: 'relative',
		padding: '1px 3px'
	};
	if (marginTop) {
		blockStyle.marginTop = `${marginTop}px`;
	}

	const controlsStyle = {
		position: 'absolute',
		backgroundColor: '#eee',
		right: '2px',
		top: '2px'
	};

	const handleMoveBlock = (from, to) => {

		const indexes = stateHandler.state.procedure.TasksHandler.getTaskIndexesByUuids([from, to]);
		const fromIndex = indexes[from];
		let toIndex = indexes[to];

		// if dropping at the end
		if (to === false) {
			toIndex = stateHandler.state.procedure.tasks.length;
		}

		if (fromIndex === -1 || toIndex === -1) {
			throw new Error(`Attempting to move timeline block from index ${fromIndex} to ${toIndex} is not possible (negative)`);
		}

		stateHandler.state.procedure.TasksHandler.moveTask(fromIndex, toIndex);
		stateHandler.saveProcedureChange();
	};

	const handleViewStepsClick = (event) => {
		console.log(`clicked "view steps" for timeline activity ${event.target.dataset.uuid}`);
		updateCurrentActivity(event.target.dataset.uuid);
		showTimeline(false);
	};

	const handleEditMetaClick = (event) => {
		console.log(`clicked "edit metadata" for timeline activity ${event.target.dataset.uuid}`);
	};

	const handleDeleteClick = (event) => {
		console.log(`clicked "delete" for timeline activity ${event.target.dataset.uuid}`);
		const taskUuid = stateHandler.state.procedure.TasksHandler
			.getTaskIndexByUuid(event.target.dataset.uuid);
		stateHandler.state.procedure.TasksHandler.deleteTask(taskUuid);
		stateHandler.saveProcedureChange();
	};

	const canDropBeforeBlock = (item, monitor) => {
		// .getItem() modified in useDrag.begin() above
		const { draggingUuid, draggingColumnIndex } = monitor.getItem();

		const thisDropItem = { uuid, columnIndex };
		const noDropUuids = stateHandler.state.procedure.TasksHandler
			.getNextUuids(draggingUuid);

		noDropUuids.push(draggingUuid); // add the dragging item to list of invalid drop locations
		return thisDropItem.columnIndex === draggingColumnIndex &&
			noDropUuids.indexOf(thisDropItem.uuid) === -1;
	};

	const dropOccurredBeforeBlock = () => {
		return { dropAtUuid: uuid };
	};

	const [{ isDragging }, drag] = useDrag({
		item: { type: ItemTypes.TIMELINE_ACTIVITY },

		// Replace the value of monitor.getItem() in useDrop.canDrop() to compare dragging-block
		// to drop-location-block
		begin: () => {
			return { draggingUuid: uuid, draggingColumnIndex: columnIndex };
		},

		// monitor.getDropResult() set by useDrop.drop()
		end: (item, monitor) => {
			if (monitor.didDrop()) {
				const { dropAtUuid } = monitor.getDropResult();
				const draggedFrom = uuid;
				handleMoveBlock(draggedFrom, dropAtUuid);
			}
		},
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging()
		})
	});

	console.log('minutesGap', minutesGap);
	const timeWasteWarning = minutesGap > 0 ?
		<span style={{ color: 'red', fontWeight: 'bold', marginLeft: '10px' }}>
			{minutesGap} minutes wasted before this activity!
		</span> : null;

	return (
		<div
			key={uuid}
			data-uuid={uuid}
			className="task-block"
			style={{
				...blockStyle,
				opacity: isDragging ? 0.5 : 1
			}}
			ref={drag}
		>
			<span>{title}</span>
				&nbsp;
			<span>({duration})</span>
			{timeWasteWarning}
			<div style={controlsStyle} className='modify-timeline-activity-controls'>
				<button onClick={handleViewStepsClick} data-uuid={uuid}>
						view steps
				</button>
				<button onClick={handleEditMetaClick} data-uuid={uuid}>
						edit metadata
				</button>
				<button onClick={handleDeleteClick} data-uuid={uuid}>
						delete
				</button>
			</div>
			<SummaryTimelineBlockDropLocationComponent
				canDropFn={canDropBeforeBlock}
				dropFn={dropOccurredBeforeBlock}
				position='top'
			/>
		</div>
	);

};

SummaryTimelineComponent.propTypes = {
	showTimeline: PropTypes.func.isRequired,
	updateCurrentActivity: PropTypes.func.isRequired,
	height: PropTypes.number.isRequired,
	fillColor: PropTypes.string.isRequired,
	textSize: PropTypes.number.isRequired,
	marginTop: PropTypes.number.isRequired,
	title: PropTypes.string.isRequired,
	duration: PropTypes.string.isRequired,
	minutesGap: PropTypes.number,
	uuid: PropTypes.string.isRequired
};

module.exports = SummaryTimelineComponent;